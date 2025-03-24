"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, MedicalCenter, Patient, Doctors, Specialties, Specialties_doctor, Appointment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

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

    response_body = {
        "msg": "GET / Data solo 1 Doctor",
        "Doctor": doctor_one.serialize() 
    }
    return jsonify(response_body), 200

#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST-----NEW DOCTOR-------------------------------------------------#
@api.route('/doctors', methods=['POST'])
def post_doctor():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar que los datos necesarios estén presentes
    if not data:
         raise APIException('No se proporcionaron datos', status_code=400)
    if 'email' not in data:
         raise APIException('El campo "email" es requerido', status_code=400)
    if data["first_name"]=="":
        raise APIException('El campo "first_name" es requerido', status_code=400)

    # siempre tiene que haber data dentro de los corchetes.
    new_doctor = Doctors(
        email=data["email"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        phone_number=data["phone_number"],
        password=data["password"],
        is_active=True  
    )
    # Guardar el nuevo doctor en la base de datos
    db.session.add(new_doctor)
    db.session.commit()

    # Devolver una respuesta con el planeta creado
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
    # Buscar el doctor en la base de datos
    doctor_one = Doctors.query.get(doctor_id)

    if not doctor_one:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se enviaron datos"}), 400

    # Actualizar los campos si existen en el JSON recibido
    doctor_one.email = data.get("email", doctor_one.email)
    doctor_one.first_name = data.get("first_name", doctor_one.first_name)
    doctor_one.last_name = data.get("last_name", doctor_one.last_name)
    doctor_one.phone_number = data.get("phone_number", doctor_one.phone_number)

  
    db.session.commit()

    return jsonify({
        "msg": f"Doctor con ID {doctor_id} actualizado correctamente",
        "updated_doctor": doctor_one.serialize()
    }), 200

#//////////////////////////////END //////DOCTOR

#//////////////////////////////Beguin //////Medical Center

@api.route('/medical_centers', methods=['GET'])
def get_centers():
    centers = MedicalCenter.query.all()
    return jsonify([{
        'id': c.id, 'name': c.name, 'address': c.address,
        'country': c.country, 'city': c.city, 'phone': c.phone, 'email': c.email
    } for c in centers])

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
        'email': new_center.email
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
    required_fields = ['email', 'first_name', 'last_name', 'gender', 'birth_date', 'phone_number', 'password']
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
    
    # Actualiza los campos del paciente
    patient.email = data['email']
    patient.first_name = data['first_name']
    patient.last_name = data['last_name']
    patient.gender = data['gender']
    patient.birth_date = birth_date
    patient.phone_number = data['phone_number']
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
def get_appointments():
    list_appointments = Appointment.query.all()
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
def post_appointment():
    data = request.get_json()

    # Validate required fields
    required_fields = ['id_patient', 'id_doctor', 'id_center', 'date', 'hour', 'id_specialty', 'confirmation']
    for field in required_fields:
        if field not in data:
            raise APIException(f'The field "{field}" is required', status_code=400)

    # Validate date and hour format
    try:
        appointment_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        appointment_hour = datetime.strptime(data["hour"], "%H:%M").time()
    except ValueError:
        raise APIException("Invalid date or hour format. Use YYYY-MM-DD for date and HH:MM for hour", status_code=400)

    # Validate foreign keys
    if not Patient.query.get(data["id_patient"]):
        raise APIException("Patient not found", status_code=404)
    if not Doctors.query.get(data["id_doctor"]):
        raise APIException("Doctor not found", status_code=404)
    if not MedicalCenter.query.get(data["id_center"]):
        raise APIException("Medical Center not found", status_code=404)
    if not Specialties.query.get(data["id_specialty"]):
        raise APIException("Specialty not found", status_code=404)

    # Validate confirmation value
    if data["confirmation"] not in ["confirmed", "to_be_confirmed"]:
        raise APIException("Confirmation must be 'confirmed' or 'to_be_confirmed'", status_code=400)

    new_appointment = Appointment(
        id_patient=data["id_patient"],
        id_doctor=data["id_doctor"],
        id_center=data["id_center"],
        date=appointment_date,
        hour=appointment_hour,
        id_specialty=data["id_specialty"],
        confirmation=data["confirmation"]
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
