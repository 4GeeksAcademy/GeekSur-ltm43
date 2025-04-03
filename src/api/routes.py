"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, MedicalCenter, Patient, Doctors, Specialties, Specialties_doctor, Appointment, Review, MedicalCenterDoctor
from api.utils import generate_sitemap, APIException, upload_image, delete_image
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from itertools import chain
import json

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
#//////////////////////////////START //////NO BORRAR

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#//////////////////////////////START //////NO BORRAR

#//////////////////////////////START //////DOCTOR
#-------------------------------------GET-----ALL DOCTORS------------------------------------------------#

@api.route('/doctors', methods=['GET'])
def get_doctors():
    list_doctors = Doctors.query.all()
    obj_all_doctors = [doctor.serialize() for doctor in list_doctors]

    response_body = {
        "msg": "GET / Doctors for this project",
        "Doctors": obj_all_doctors   # salida de all Doctores
    }
    return jsonify(response_body), 200

#----------------------------------GET------1 ID-DOCTOR---------------------------------------------------------#
@api.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor_id(doctor_id):
    doctor_one = Doctors.query.get(doctor_id)

    if not doctor_one:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    return jsonify(doctor_one.serialize()), 200
#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST-----NEW DOCTOR-------------------------------------------------#
@api.route('/doctors', methods=['POST'])
def post_doctor():
    # Obtener los datos del formulario (multipart/form-data)
    email = request.form.get("email")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    phone_number = request.form.get("phone_number")
    password = request.form.get("password")
    file = request.files.get("photo")

    # Validar los campos requeridos
    if not email:
        raise APIException('El campo "email" es requerido', status_code=400)
    if not first_name:
        raise APIException('El campo "first_name" es requerido', status_code=400)

    # Subir la imagen a Cloudinary si se proporcionó
    image_url = None
    if file:
        image_url = upload_image(file)

    new_doctor = Doctors(
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        password=password,
        url=image_url,
        is_active=True  
    )
    db.session.add(new_doctor)
    db.session.commit()

    response_body = {
        "msg": f"El nuevo Doctor creado es: {new_doctor.first_name}",
        "new_Doctor": new_doctor.serialize() 
    }
    return jsonify(response_body), 201

#-------------------------------------DELETE-----Doctor------------------------------------------------#

@api.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    doctor_one = Doctors.query.get(doctor_id)

    if not doctor_one:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    db.session.delete(doctor_one)
    db.session.commit()

    return jsonify({"msg": f"Doctor con ID {doctor_id} eliminado correctamente"}), 200

#-------------------------------------PUT----Doctor----------------------------------------------------#

@api.route('/doctors/<int:doctor_id>', methods=['PUT'])
def update_doctor(doctor_id):
    doctor_one = Doctors.query.get(doctor_id)

    if not doctor_one:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    # Obtener los datos del formulario
    email = request.form.get("email")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    phone_number = request.form.get("phone_number")
    file = request.files.get("photo")  # Obtener el archivo de imagen
    remove_image = request.form.get("remove_image") == "true"

    # Actualizar los campos si se proporcionaron
    doctor_one.email = email if email else doctor_one.email
    doctor_one.first_name = first_name if first_name else doctor_one.first_name
    doctor_one.last_name = last_name if last_name else doctor_one.last_name
    doctor_one.phone_number = phone_number if phone_number else doctor_one.phone_number

    # Manejar la imagen
    if remove_image and doctor_one.url:  # Si se solicita eliminar la imagen
        delete_image(doctor_one.url)  # Eliminar la imagen de Cloudinary
        doctor_one.url = None  # Establecer el campo url como null
    elif file:  # Si se proporciona una nueva imagen
        # Si ya había una imagen, eliminarla primero
        if doctor_one.url:
            delete_image(doctor_one.url)
        image_url = upload_image(file)
        doctor_one.url = image_url

    db.session.commit()

    return jsonify({
        "msg": f"Doctor con ID {doctor_id} actualizado correctamente",
        "updated_doctor": doctor_one.serialize()
    }), 200

#//////////////////////////////END //////DOCTOR

#//////////////////////////////Beguin //////doctor_appointment

@api.route('/doctor/appointments', methods=['GET'])
@jwt_required()
def get_doctor_appointments():
    doctor_id = get_jwt_identity()  # Obtener el ID del doctor desde el token
    doctor = Doctors.query.get(doctor_id)  # Cambiar "Doctor" por "Doctors"
    if not doctor:
        return jsonify({"msg": "Doctor not found"}), 404

    appointments = Appointment.query.filter_by(id_doctor=doctor_id).all()
    if not appointments:
        return jsonify({"msg": "No appointments found for this doctor"}), 404

    return jsonify({
        "msg": "Appointments retrieved successfully",
        "appointments": [appointment.serialize() for appointment in appointments]
    }), 200

@api.route('/doctor/appointments/<int:appointment_id>', methods=['PUT'])
@jwt_required()
def manage_doctor_appointment(appointment_id):
    doctor_id = int(get_jwt_identity())  # Convertir a entero
    appointment = Appointment.query.get(appointment_id)
    
    if not appointment:
        return jsonify({"msg": "Appointment not found"}), 404
    if appointment.id_doctor != doctor_id:
        return jsonify({"msg": "You are not authorized to manage this appointment"}), 403

    data = request.get_json()
    action = data.get("action")

    if action == "cancel":
        appointment.confirmation = "cancelled"
    elif action == "complete":
        appointment.confirmation = "completed"
    else:
        return jsonify({"msg": "Invalid action. Use 'cancel' or 'complete'"}), 400

    db.session.commit()
    return jsonify({"msg": f"Appointment {action}ed successfully", "appointment": appointment.serialize()}), 200

        #//////////////////////////////End //////doctor_appointment

#//////////////////////////////Beguin //////Medical Center

@api.route('/medical_centers', methods=['GET'])
def get_centers():
    try:
        centers = MedicalCenter.query.all()
        return jsonify([center.serialize() for center in centers])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Agregar un nuevo centro médico
@api.route('/medical_centers', methods=['POST'])
def add_center():
    data = request.json
    new_center = MedicalCenter(**data)
    db.session.add(new_center)
    db.session.commit()
    return jsonify({
        'id': new_center.id,
        'name': new_center.name,
        'address': new_center.address,
        'country': new_center.country,
        'city': new_center.city,
        'phone': new_center.phone,
        'email': new_center.email,
        'latitude': new_center.latitude, 
        'longitude': new_center.longitude
    }), 201

# Actualizar un centro médico
@api.route('/medical_centers/<int:id>', methods=['PUT'])
def update_center(id):
    center = MedicalCenter.query.get(id)
    if not center:
        return jsonify({'message': 'Medical Center not found'}), 404

    data = request.json
    for key, value in data.items():
        setattr(center, key, value)

    db.session.commit()
    return jsonify({'message': 'Medical Center updated!'})

# Eliminar un centro médico
@api.route('/medical_centers/<int:id>', methods=['DELETE'])
def delete_center(id):
    center = MedicalCenter.query.get(id)
    if not center:
        return jsonify({'message': 'Medical Center not found'}), 404

    db.session.delete(center)
    db.session.commit()
    return jsonify({'message': 'Medical Center deleted!'})
#//////////////////////////////END //////Medical Center

########## Beguin patients services###############

@api.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.serialize() for patient in patients]), 200
    
@api.route('/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    
    required_fields = ['email', 'first_name', 'last_name', 'gender', 'birth_date', 'phone_number', 'password']
    for field in required_fields:
        if field not in data:
            raise APIException(f"Missing required field: {field}", status_code=400)
    
    if '@' not in data['email']:
        raise APIException("Invalid email format", status_code=400)
    
    if data['gender'] not in ['male', 'female']:
        raise APIException("Gender must be 'male' or 'female'", status_code=400)
    
    try:
        birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
    except ValueError:
        raise APIException("Invalid birth_date format, use YYYY-MM-DD", status_code=400)
    
    if Patient.query.filter_by(email=data['email']).first():
        raise APIException("Email already exists", status_code=400)
    
    new_patient = Patient(
        email=data['email'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        gender=data['gender'],
        birth_date=birth_date,
        phone_number=data['phone_number'],
        password=data['password']
    )
    
    db.session.add(new_patient)
    db.session.commit()
    
    return jsonify(new_patient.serialize()), 201

@api.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):
    # Busca el paciente por ID
    patient = Patient.query.get_or_404(id)
    
    # Obtiene los datos del cuerpo de la solicitud
    data = request.get_json()
    
    # Campos requeridos (todos deben enviarse)
    required_fields = ['email', 'first_name', 'last_name', 'gender', 'birth_date', 'phone_number']
    for field in required_fields:
        if field not in data:
            raise APIException(f"Missing required field: {field}", status_code=400)
    
    # Validaciones
    if '@' not in data['email']:
        raise APIException("Invalid email format", status_code=400)
    
    if data['gender'] not in ['male', 'female']:
        raise APIException("Gender must be 'male' or 'female'", status_code=400)
    
    try:
        birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
    except ValueError:
        raise APIException("Invalid birth_date format, use YYYY-MM-DD", status_code=400)
    
    # Verifica si el nuevo email ya existe y no pertenece al mismo paciente
    existing_patient = Patient.query.filter_by(email=data['email']).first()
    if existing_patient and existing_patient.id != id:
        raise APIException("Email already exists", status_code=400)
    
    # Actualiza los campos del paciente (excepto password)
    patient.email = data['email']
    patient.first_name = data['first_name']
    patient.last_name = data['last_name']
    patient.gender = data['gender']
    patient.birth_date = birth_date
    patient.phone_number = data['phone_number']

    if 'password' in data:
        patient.password = data['password']
    
    db.session.commit()
    
    return jsonify(patient.serialize()), 200

@api.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    # Busca el paciente por ID
    patient = Patient.query.get_or_404(id)
    
    # Elimina el paciente de la base de datos
    db.session.delete(patient)
    db.session.commit()
    
    # Retorna una respuesta vacía con código 200
    return jsonify({"message": f"Patient with id {id} has been deleted"}), 200
################## End patients services#########

 ################## Beguin login patients services##############

# Ruta para login de pacientes
@api.route('/loginpatient', methods=['POST'])
def login_patient():
    data = request.get_json()

    # Validar que se envíen email y password
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Faltan email o password"}), 400

    # Buscar al paciente en la base de datos
    patient = Patient.query.filter_by(email=data['email']).first()

    # Verificar si el paciente existe y la contraseña es correcta
    if not patient or patient.password != data['password']:
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401
    
    # Imprimir el valor de patient.id para depurar
    print(f"patient.id: {patient.id}, tipo: {type(patient.id)}")

    # Generar el tokenpatient (access token)
    tokenpatient = create_access_token(identity=str(patient.id))
    
    return jsonify({
        "msg": "Login exitoso",
        "tokenpatient": tokenpatient,
        "patient": patient.serialize()
    }), 200

# Ruta protegida para el dashboard de pacientes
@api.route('/dashboardpatient', methods=['GET'])
@jwt_required()
def dashboard_patient():
    # Obtener el ID del paciente desde el token
    patient_id = get_jwt_identity()

    # Buscar al paciente en la base de datos
    patient = Patient.query.get(patient_id)
    if not patient:
        return jsonify({"msg": "Paciente no encontrado"}), 404

    # Retornar información del paciente (puedes personalizar lo que quieras mostrar)
    return jsonify({
        "msg": "Bienvenido al dashboard del paciente",
        "patient": patient.serialize()
    }), 200

            ################## End login patients services##############

#////////////////////////////////////////////////////START //////////////////SPECIALITIES////////////////////////////
#-------------------------------------GET-----ALL SPECIALITIES------------------------------------------------#

@api.route('/specialties', methods=['GET'])
def get_specialties():
    list_specialties = Specialties.query.all()
    obj_all_specialties = [specialties.serialize() for specialties in list_specialties]

    response_body = {
       "msg": "GET / Specialties from Tabla",
       "Specialties": obj_all_specialties
    }
    return jsonify(response_body), 200
#----------------------------------GET------1 ID-SPECIALITIES----------------------------------------------#
@api.route('/specialties/<int:specialty_id>', methods=['GET'])
def get_specialty_id(specialty_id):
    specialty_one = Specialties.query.get(specialty_id)

    response_body = {
    "msg": "GET / Data solo 1 Especialidad",
 	"Specialties":  specialty_one.serialize() 
    }
    return jsonify(response_body), 200
#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST-----NEW DOCTOR-------------------------------------------------#
@api.route('/specialties', methods=['POST'])
def post_specialties():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar que los datos necesarios estén presentes
    if not data:
         raise APIException('No se proporcionaron datos', status_code=400)
    if 'name' not in data:
         raise APIException('El campo "name" es requerido', status_code=400)
    if data["name"]=="":
        raise APIException('El campo "name" es requerido', status_code=400)

    # siempre tiene que haber data dentro de los corchetes.
    new_specialty = Specialties(
       name=data["name"]
    )
    # Guardar el nueva especialidad en la base de datos
    db.session.add(new_specialty)
    db.session.commit()

    # Devolver una respuesta con el planeta creado
    response_body = {
        "msg": f"la nueva Especialidad creada es: {new_specialty.name}",
        "new_Specialty": new_specialty.serialize() 
        }
    return jsonify(response_body), 201

#-------------------------------------DELETE-----Doctor------------------------------------------------#

@api.route('/specialties/<int:specialty_id>', methods=['DELETE'])
def delete_specialty(specialty_id):
    specialty_one = Specialties.query.get(specialty_id)

    if not specialty_one:
        return jsonify({"msg": "Especialidad no encontrado"}), 404

    db.session.delete(specialty_one)
    db.session.commit()

    return jsonify({"msg": f"Especialidad con ID {specialty_id} eliminado correctamente"}), 200

#-------------------------------------PUT----SPECIALITIES----------------------------------------------------#

@api.route('/specialties/<int:specialty_id>', methods=['PUT'])
def update_specialty(specialty_id):
    # Buscar el Especialidad en la base de datos
    specialty_one = Specialties.query.get(specialty_id)

    if not specialty_one:
        return jsonify({"msg": "Especialidad no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se enviaron datos"}), 400

    # Actualizar los campos si existen en el JSON recibido
    specialty_one.name = data.get("name", specialty_one.name)
      
    db.session.commit()

    return jsonify({
        "msg": f"Especialidad con ID {specialty_id} actualizado correctamente",
        "update_specialty":  specialty_one.serialize()
    }), 200

#//////////////////////////////////////////////////END //////////////////SPECIALITIES////////////////////////////######

#//////////////////////////////START //////SPECIALTIES_DOCTOR////////////////////////////////////////////////////////

#-------------------------------------GET-----ALL SPECIALTIES_DOCTOR-----------------------------------------------#

@api.route('/specialties_doctor', methods=['GET'])
def get_specialties_doctor():
    list_specialties_doctor = Specialties_doctor.query.all()
    obj_all_specialties_doctor = [specialties_doctor.serialize() for specialties_doctor in list_specialties_doctor]

    response_body = {
       "msg": "GET / Specialties_doctor from Tabla",
       "Specialties_doctor": obj_all_specialties_doctor
    }
    return jsonify(response_body), 200

#----------------------------------GET------1 ID-SPECIALTIES_DOCTOR-----------------------------------------------#
@api.route('/specialties_doctor/<int:specialty_id>', methods=['GET'])
def get_specialty_doctor_id(specialty_id):
    specialty_doctor_one = Specialties_doctor.query.get(specialty_id)

    response_body = {
    "msg": "GET / Data solo 1 Especialidad_doctor",
    "Specialties_doctor":  specialty_doctor_one.serialize() 
    }
    return jsonify(response_body), 200

#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST-----NEW SPECIALTIES_DOCTOR-------------------------------------------------#
@api.route('/specialties_doctor', methods=['POST'])
def post_specialties_doctor():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar que los datos necesarios estén presentes
    if not data:
         raise APIException('No se proporcionaron datos', status_code=400)
    if 'id_specialty' not in data or 'id_doctor' not in data:
         raise APIException('El campo  "id_specialty" y "id_doctor" es requerido', status_code=400)
    
    # siempre tiene que haber data dentro de los corchetes.
    new_specialty_doctor = Specialties_doctor(
    id_specialty=data["id_specialty"],
    id_doctor=data["id_doctor"]
    )
    # Guardar el nueva especialidad_doctor en la base de datos
    db.session.add(new_specialty_doctor)
    db.session.commit()

    # Devolver una respuesta con el especialidad_doctor creado
    response_body = {
        "msg": "Se creo nueva especialidad",
        "new_Specialty_doctor": new_specialty_doctor.serialize() 
        }
    return jsonify(response_body), 201

#-------------------------------------DELETE----SPECIALTIES_DOCTOR-----------------------------------------------#

@api.route('/specialties_doctor/<int:specialty_id>', methods=['DELETE'])
def delete_specialty_doctor(specialty_id):
    specialty_doctor_one = Specialties_doctor.query.get(specialty_id)

    if not specialty_doctor_one:
        return jsonify({"msg": "Especialidad_doctor no encontrado"}), 404

    db.session.delete(specialty_doctor_one)
    db.session.commit()

    return jsonify({"msg": f"Especialidad_doctor con ID {specialty_id} eliminado correctamente"}), 200

#-------------------------------------PUT---SPECIALTIES_DOCTOR-------------------------------------------------#

@api.route('/specialties_doctor/<int:specialty_id>', methods=['PUT'])
def update_specialty_doctor(specialty_id):
    # Buscar el Especialidad_doctor en la base de datos
    specialty_doctor_one = Specialties_doctor.query.get(specialty_id)

    if not specialty_doctor_one:
        return jsonify({"msg": "Especialidad_doctor no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se enviaron datos"}), 400

    # Actualizar los campos si existen en el JSON recibido
    specialty_doctor_one.id_specialty = data.get("id_specialty", specialty_doctor_one.id_specialty)
    specialty_doctor_one.id_doctor = data.get("id_doctor", specialty_doctor_one.id_doctor)
      
    db.session.commit()

    return jsonify({
        "msg": f"Especialidad_doctor con ID {specialty_id} actualizado correctamente",
        "update_specialty_doctor":  specialty_doctor_one.serialize()
    }), 200

#//////////////////////////////START //////APPOINTMENT

#-------------------------------------GET-----ALL APPOINTMENTS------------------------------------------------#

@api.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    # Obtener el ID del paciente del token
    id_patient = get_jwt_identity()
# Filtrar las citas por el ID del paciente
    list_appointments = Appointment.query.filter_by(id_patient=id_patient).all()
    obj_all_appointments = [appointment.serialize() for appointment in list_appointments]

    response_body = {
        "msg": "GET / Appointments for this project",
        "Appointments": obj_all_appointments
    }
    return jsonify(response_body), 200

#----------------------------------GET------1 ID-APPOINTMENT---------------------------------------------------------#
@api.route('/appointments/<int:appointment_id>', methods=['GET'])
def get_appointment_id(appointment_id):
    appointment_one = Appointment.query.get(appointment_id)
    if not appointment_one:
        return jsonify({"msg": "Appointment not found"}), 404

    response_body = {
        "msg": "GET / Data for one Appointment",
        "Appointment": appointment_one.serialize()
    }
    return jsonify(response_body), 200

#-------------------------------------POST-----NEW APPOINTMENT-------------------------------------------------#
@api.route('/appointments', methods=['POST'])
@jwt_required()  # Agrega el decorador para requerir un token válido
def post_appointment():
    data = request.get_json()

    # Obtener el ID del paciente del token
    id_patient = get_jwt_identity()

    # Validate required fields (except id_patient)
    required_fields = ['id_doctor', 'id_center', 'date', 'hour', 'id_specialty']
    
    for field in required_fields:
        if field not in data:
            raise APIException(f'The field "{field}" is required', status_code=400)

    # Validate date and hour format
    try:
        appointment_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        appointment_hour = datetime.strptime(data["hour"], "%H:%M").time()
    except ValueError:
        raise APIException("Invalid date or hour format. Use YYYY-MM-DD for date and HH:MM for hour", status_code=400)

    # Validate foreign keys (except id_patient)
    if not Doctors.query.get(data["id_doctor"]):
        raise APIException("Doctor not found", status_code=404)
    if not MedicalCenter.query.get(data["id_center"]):
        raise APIException("Medical Center not found", status_code=404)
    if not Specialties.query.get(data["id_specialty"]):
        raise APIException("Specialty not found", status_code=404)

    # Validate confirmation value
    # if data["confirmation"] not in ["confirmed", "to_be_confirmed"]:
    #     raise APIException("Confirmation must be 'confirmed' or 'to_be_confirmed'", status_code=400)

    new_appointment = Appointment(
        id_patient=id_patient, 
        id_doctor=data["id_doctor"],
        id_center=data["id_center"],
        date=appointment_date,
        hour=appointment_hour,
        id_specialty=data["id_specialty"],
        confirmation="confirmed"
    )

    db.session.add(new_appointment)
    db.session.commit()

    response_body = {
        "msg": "New Appointment created successfully",
        "new_appointment": new_appointment.serialize()
    }
    return jsonify(response_body), 201
#-------------------------------------DELETE-----APPOINTMENT------------------------------------------------#

@api.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    appointment_one = Appointment.query.get(appointment_id)

    if not appointment_one:
        return jsonify({"msg": "Appointment not found"}), 404

    db.session.delete(appointment_one)
    db.session.commit()

    return jsonify({"msg": f"Appointment with ID {appointment_id} deleted successfully"}), 200

#-------------------------------------PUT----APPOINTMENT----------------------------------------------------#

@api.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    appointment_one = Appointment.query.get(appointment_id)

    if not appointment_one:
        return jsonify({"msg": "Appointment not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    # Update fields if provided
    if "id_patient" in data:
        if not Patient.query.get(data["id_patient"]):
            raise APIException("Patient not found", status_code=404)
        appointment_one.id_patient = data["id_patient"]

    if "id_doctor" in data:
        if not Doctors.query.get(data["id_doctor"]):
            raise APIException("Doctor not found", status_code=404)
        appointment_one.id_doctor = data["id_doctor"]

    if "id_center" in data:
        if not MedicalCenter.query.get(data["id_center"]):
            raise APIException("Medical Center not found", status_code=404)
        appointment_one.id_center = data["id_center"]

    if "date" in data:
        try:
            appointment_one.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            raise APIException("Invalid date format. Use YYYY-MM-DD", status_code=400)

    if "hour" in data:
        try:
            appointment_one.hour = datetime.strptime(data["hour"], "%H:%M").time()
        except ValueError:
            raise APIException("Invalid hour format. Use HH:MM", status_code=400)

    if "id_specialty" in data:
        if not Specialties.query.get(data["id_specialty"]):
            raise APIException("Specialty not found", status_code=404)
        appointment_one.id_specialty = data["id_specialty"]

    if "confirmation" in data:
        if data["confirmation"] not in ["confirmed", "to_be_confirmed"]:
            raise APIException("Confirmation must be 'confirmed' or 'to_be_confirmed'", status_code=400)
        appointment_one.confirmation = data["confirmation"]

    db.session.commit()

    return jsonify({
        "msg": f"Appointment with ID {appointment_id} updated successfully",
        "updated_appointment": appointment_one.serialize()
    }), 200

#//////////////////////////////END //////APPOINTMENT
#///////////////////// BEGIN REVIEWS /////////////////////////////
@api.route('/reviews', methods=['GET'])
def get_reviews():
    list_reviews = Review.query.all()
    obj_all_reviews = [review.serialize() for review in list_reviews]

    response_body = {
        "msg": "GET / Reviews for this project",
        "Reviews": obj_all_reviews
    }
    return jsonify(response_body), 200

@api.route('/reviews/<int:review_id>', methods=['GET'])
def get_review_id(review_id):
    review_one = Review.query.get(review_id)
    if not review_one:
        return jsonify({"msg": "Review not found"}), 404

    response_body = {
        "msg": "GET / Data for one Review",
        "Review": review_one.serialize()
    }
    return jsonify(response_body), 200

@api.route('/reviews', methods=['POST'])
def post_review():
    data = request.get_json()

    # Validate required fields
    required_fields = ['id_doctor', 'id_patient', 'date', 'id_center', 'rating', 'comments']
    for field in required_fields:
        if field not in data:
            raise APIException(f'The field "{field}" is required', status_code=400)

    # Validate date format
    try:
        review_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
    except ValueError:
        raise APIException("Invalid date format. Use YYYY-MM-DD", status_code=400)

    # Validate rating range 
    if not (1 <= data.get('rating', 0) <= 5):
        raise APIException("Rating must be between 1 and 5", status_code=400)

    # Validate foreign keys (si es necesario)
    if not Doctors.query.get(data.get('id_doctor')):
        raise APIException("Doctor not found", status_code=404)
    if not Patient.query.get(data.get('id_patient')):
        raise APIException("Patient not found", status_code=404)
    if not MedicalCenter.query.get(data.get('id_center')):
        raise APIException("Medical Center not found", status_code=404)

    new_review = Review(
        id_doctor=data["id_doctor"],
        id_patient=data["id_patient"],
        date=review_date,
        id_center=data["id_center"],
        rating=data["rating"],
        comments=data["comments"]
    )

    db.session.add(new_review)
    db.session.commit()

    response_body = {
        "msg": "New Review created successfully",
        "new_review": new_review.serialize()
    }
    return jsonify(response_body), 201

#-------------------------------------DELETE-----REVIEW------------------------------------------------#

@api.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review_one = Review.query.get(review_id)

    if not review_one:
        return jsonify({"msg": "Review not found"}), 404

    db.session.delete(review_one)
    db.session.commit()

    return jsonify({"msg": f"Review with ID {review_id} deleted successfully"}), 200

#-------------------------------------PUT----REVIEW----------------------------------------------------#

@api.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    review_one = Review.query.get(review_id)

    if not review_one:
        return jsonify({"msg": "Review not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    # Update fields if provided
    if "id_doctor" in data:
        if not Doctors.query.get(data["id_doctor"]):
            raise APIException("Doctor not found", status_code=404)
        review_one.id_doctor = data["id_doctor"]

    if "id_patient" in data:
        if not Patient.query.get(data["id_patient"]):
            raise APIException("Patient not found", status_code=404)
        review_one.id_patient = data["id_patient"]

    if "date" in data:
        try:
            review_one.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except ValueError:
            raise APIException("Invalid date format. Use YYYY-MM-DD", status_code=400)

    if "id_center" in data:
        if not MedicalCenter.query.get(data["id_center"]):
            raise APIException("Medical Center not found", status_code=404)
        review_one.id_center = data["id_center"]

    if "rating" in data:
        if not (1 <= data.get('rating', 0) <= 5):
            raise APIException("Rating must be between 1 and 5", status_code=400)
        review_one.rating = data["rating"]

    if "comments" in data:
        review_one.comments = data["comments"]

    db.session.commit()

    return jsonify({
        "msg": f"Review with ID {review_id} updated successfully",
        "updated_review": review_one.serialize()
    }), 200

#////////////////////// END REVIEWS ///////////////////

#////////////////////// BEGIN SEARCH PROFESSIONALS ///////////////////
@api.route('/specialties', methods=['GET'])
def get_all_specialties():
    list_specialties = Specialties.query.all()
    obj_all_specialties = [specialty.serialize() for specialty in list_specialties]

    response_body = {
        "msg": "GET / Specialties for search professionals",
        "Specialties": obj_all_specialties
        }    
    return jsonify(response_body), 200


@api.route('/professionals/search', methods=['POST'])
def search_professionals():
    try:
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        name = data.get('name')
        specialty_id = data.get('specialty')
        city = data.get('city')
        country = data.get('country')

        doctors_query = Doctors.query.filter_by(is_active=True)

        if name:
            search_term = f'%{name.lower()}%'
            doctors_query = doctors_query.filter(
                or_(
                    db.func.lower(Doctors.first_name).like(search_term),
                    db.func.lower(Doctors.last_name).like(search_term)
                )
            )

        if specialty_id:
            doctors_query = doctors_query.join(Specialties_doctor, Doctors.id == Specialties_doctor.id_doctor).filter(Specialties_doctor.id_specialty == specialty_id)

        if city:
            doctors_query = doctors_query.join(Appointment, Doctors.id == Appointment.id_doctor).join(MedicalCenter, Appointment.id_center == MedicalCenter.id).filter(db.func.lower(MedicalCenter.city).like(f'%{city.lower()}%'))

        if country:
            doctors_query = doctors_query.join(Appointment, Doctors.id == Appointment.id_doctor).join(MedicalCenter, Appointment.id_center == MedicalCenter.id).filter(db.func.lower(MedicalCenter.country).like(f'%{country.lower()}%'))

        doctors = doctors_query.all()
        results = []
        for doctor in doctors:
            specialties = [spec.Specialties.serialize() for spec in doctor.specialties]
            medical_centers = set([MedicalCenter.query.get(apt.id_center).serialize() for apt in doctor.appointments if apt.id_center]) if doctor.appointments else []

            doctor_info = doctor.serialize()
            doctor_info['name'] = f"{doctor.first_name} {doctor.last_name}"
            del doctor_info['first_name']
            del doctor_info['last_name']
            doctor_info['specialties'] = [spec['name'] for spec in specialties]
            doctor_info['medical_centers'] = [
                {'name': mc['name'], 'city': mc['city'], 'country': mc['country']} for mc in medical_centers
            ]
            results.append(doctor_info)

        logging.debug(f"Search results: {results}")
        return jsonify(results), 200

    except Exception as e:
        logging.error(f"Error in search_professionals: {e}")
        return jsonify({"error": str(e)}), 500

@api.route('/search-doctor', methods=['POST'])
def searchdoctor():
    data = request.json
    print(data)

    list_specialties = Specialties.query.all()
    obj_all_specialties = [specialty.serialize() for specialty in list_specialties]

    filtered_specialties = list(filter(lambda x: data["specialty"].lower() in x['name'].lower(), obj_all_specialties))
    print(filtered_specialties)
    if len(filtered_specialties) == 0:
        return jsonify({"msg": "No specialties found"}), 404
    if len(filtered_specialties) > 0 and data["name"] == "":
        return jsonify({"results": filtered_specialties[0]["specialties"]}), 200
    elif len(filtered_specialties) > 0 and data["name"] != "":
        filtered_professional = list(filter(lambda x: data["name"].lower() in x["info_doctor"]["first_name"].lower() or data["name"].lower() in x["info_doctor"]["last_name"].lower(), filtered_specialties[0]["specialties"]))
        return jsonify({"results": filtered_professional}), 200
    else:
        map_specialties = list(chain(*map(lambda x: x["specialties"], obj_all_specialties)))
        filtered_results = list(filter(lambda x: data["name"].lower() in x["info_doctor"]["first_name"].lower() or data["name"].lower() in x["info_doctor"]["last_name"].lower() , map_specialties))
        return jsonify({"results":filtered_results}), 200
    
    

#////////////////////// END SEARCH PROFESSIONALS ///////////////////


#/////////////////START///////////////////////# DOCTORLOGIN///////////////////////////////////////////////
@api.route('/logindoctor', methods=['POST'])
def login_doctor():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"msg": "Faltan email o password"}), 400

    doctor = Doctors.query.filter_by(email=data['email']).first()

    # Verificar si el doctor existe y la contraseña es correcta
    if not doctor or doctor.password != data['password']:
        return jsonify({"msg": "Email o contraseña incorrectos"}), 401
    
    # Imprimir el valor de doctor.id para depurar
    print(f"doctor.id: {doctor.id}, tipo: {type(doctor.id)}")

    # Generar el tokendoctor con un ID simple (como pacientes)
    tokendoctor = create_access_token(identity=str(doctor.id))
    
    return jsonify({
        "msg": "Login exitoso",
        "tokendoctor": tokendoctor,
        "doctor": doctor.serialize()
    }), 200

##////////////////////////////////////////////////// Ruta protegida para el dashboard de Doctor  doctor

@api.route('/dashboarddoctor', methods=['GET'])
@jwt_required()
def dashboard_doctor():
    # Obtener el ID del doctor desde el token (como cadena)
    doctor_id = get_jwt_identity()

    # Buscar al doctor en la base de datos
    doctor = Doctors.query.get(doctor_id)
    if not doctor:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    # Retornar información del doctor
    return jsonify({
        "msg": "Bienvenido al dashboard del doctor",
        "doctor": doctor.serialize()
    }), 200
#/////////////////START/////////////////////////////////////////# DOCTORLOGIN///////////////////////////////////////////////

#//////////////////////////////START //////MEDICAL CENTER DOCTOR////////////////////////////////////////////////////////

#-------------------------------------GET-----ALL MEDICAL CENTER DOCTOR-----------------------------------------------#

@api.route('/medicalcenterdoctor', methods=['GET'])
def get_medical_center_doctor():
    list_medical_center_doctor= MedicalCenterDoctor.query.all()
    obj_all_medical_center_doctor = [medical_center_doctor.serialize() for medical_center_doctor in list_medical_center_doctor]

    response_body = {
       "msg": "GET / medical_center_doctor from Tabla",
       "MedicalCenterDoctor": obj_all_medical_center_doctor
    }
    return jsonify(response_body), 200

#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST----------------------------------------------------#
@api.route('/medicalcenterdoctor', methods=['POST'])
def post_medical_center_doctor():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar que los datos necesarios estén presentes
    if not data:
         raise APIException('No se proporcionaron datos', status_code=400)
    if 'id_medical_center' not in data or 'id_doctor' not in data:
         raise APIException('El campo  "id_medical_center" y "id_doctor" es requerido', status_code=400)
    
    # siempre tiene que haber data dentro de los corchetes.
    new_medical_center_doctor = MedicalCenterDoctor(
    id_medical_center=data["id_medical_center"],
    id_doctor=data["id_doctor"],
    office=data["office"],
    )
    # Guardar el nueva especialidad_doctor en la base de datos
    db.session.add(new_medical_center_doctor)
    db.session.commit()

    # Devolver una respuesta con el especialidad_doctor creado
    response_body = {
        "msg": "Se creo nuevo medical_center_doctor",
        "new_medical_center_doctor": new_medical_center_doctor.serialize() 
        }
    return jsonify(response_body), 201

#-------------------------------------DELETE---MEDICAL CENTER DOCTOR-----------------------------------------------#

@api.route('/medicalcenterdoctor/<int:cmd_id>', methods=['DELETE'])
def delete_medical_center_doctor(cmd_id):
    medical_center_doctor_one = MedicalCenterDoctor.query.get(cmd_id)

    if not medical_center_doctor_one:
        return jsonify({"msg": "medical_center_doctor no encontrado"}), 404

    db.session.delete(medical_center_doctor_one)
    db.session.commit()

    return jsonify({"msg": "ok"}), 200

#-------------------------------------PUT--MEDICAL CENTER DOCTOR----------------------------------------------#

@api.route('/medicalcenterdoctor/<int:cmd_id>', methods=['PUT'])
def update_medical_center_doctor(cmd_id):
    # Buscar el medical_center_doctor en la base de datos
    medical_center_doctor_one = MedicalCenterDoctor.query.get(cmd_id)

    if not medical_center_doctor_one:
        return jsonify({"msg": "Especialidad_doctor no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se enviaron datos"}), 400

    # Actualizar los campos si existen en el JSON recibido
    medical_center_doctor_one.id_medical_center = data.get("id_medical_center", medical_center_doctor_one.id_medical_center)
    medical_center_doctor_one.id_doctor = data.get("id_doctor", medical_center_doctor_one.id_doctor)
    medical_center_doctor_one.office = data.get("office", medical_center_doctor_one.office)
      
    db.session.commit()

    return jsonify({
        "msg": "actualizado correctamente",
        "update_specialty_doctor": medical_center_doctor_one.serialize()
    }), 200

################## Beguin patients appointments and patient review##############
            
            # Nueva ruta para obtener todas las citas de un paciente autenticado
@api.route('/patient/appointments', methods=['GET'])
@jwt_required()
def get_patient_appointments():
    try:
        patient_id = get_jwt_identity()  # Obtener el ID del paciente desde el token
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({"msg": "Paciente no encontrado"}), 404

        # Obtener todas las citas del paciente
        appointments = Appointment.query.filter_by(id_patient=patient_id).all()
        appointments_list = [appointment.serialize() for appointment in appointments]
        
        return jsonify({"appointments": appointments_list}), 200
    except Exception as e:
        return jsonify({"msg": f"Error al obtener las citas: {str(e)}"}), 500

# Nueva ruta para que un paciente cree una reseña
@api.route('/patient/reviews', methods=['POST'])
@jwt_required()
def create_patient_review():
    try:
        patient_id = get_jwt_identity()  # Obtener el ID del paciente desde el token
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({"msg": "Paciente no encontrado"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"msg": "No se proporcionaron datos"}), 400

        required_fields = ["id_doctor", "id_center", "rating", "comments", "date"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"msg": f"El campo {field} es requerido"}), 400

        # Validar que la cita existe para este paciente, doctor y centro médico
        appointment = Appointment.query.filter_by(
            id_patient=patient_id,
            id_doctor=data["id_doctor"],
            id_center=data["id_center"]
        ).first()
        if not appointment:
            return jsonify({"msg": "No se encontró una cita válida para esta reseña"}), 400

        # Crear la reseña
        new_review = Review(
            id_patient=patient_id,
            id_doctor=data["id_doctor"],
            id_center=data["id_center"],
            rating=data["rating"],
            comments=data["comments"],
            date=datetime.strptime(data["date"], "%Y-%m-%d")
        )
        db.session.add(new_review)
        db.session.commit()

        return jsonify({"msg": "Reseña creada exitosamente", "review": new_review.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al crear la reseña: {str(e)}"}), 500
    
    ################## End patients appointments and patient review##############
