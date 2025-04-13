"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, MedicalCenter, Patient, Doctors, Specialties, Specialties_doctor, Appointment, Review, MedicalCenterDoctor
from api.utils import generate_sitemap, APIException, upload_image, delete_image, upload_medical_center_image
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from itertools import chain
import json, cloudinary
from datetime import datetime, timedelta
import os, logging
import google.generativeai as genai 
from google.generativeai import types
import traceback
import unicodedata

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
#//////////////////////////////START //////NO BORRAR

# Configurar el cliente de Google Gen AI con la clave desde .env
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
client = genai.GenerativeModel('gemini-1.5-flash')

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
    try:
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
        doctor = Doctors.query.filter_by(email=email).first()
        if doctor:  
            raise APIException('Ya existe un doctor con ese correo', status_code=400)
        if not first_name: 
            raise APIException('El campo "first_name" es requerido', status_code=400)

        # Subir la imagen a Cloudinary si se proporcionó
        image_url = None
        if file:
            try:
                image_url = upload_image(file)
            except Exception as e:
                raise APIException(f"Error al subir la imagen a Cloudinary: {str(e)}", status_code=500)

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

    except APIException as e:
        return jsonify({"msg": e.message}), e.status_code
    except Exception as e:
        return jsonify({"msg": f"Error interno del servidor: {str(e)}"}), 500


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

@api.route('/doctors/<int:id>', methods=['PUT'])
@jwt_required()
def update_doctor(id):
    current_doctor_id = get_jwt_identity()
    doctor = Doctors.query.get(id)

    if not doctor or doctor.id != current_doctor_id:
        raise APIException('Doctor no encontrado o no autorizado', status_code=404)

    try:
        # Obtener datos del formulario
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        email = request.form.get("email")
        phone_number = request.form.get("phone_number")
        password = request.form.get("password")
        file = request.files.get("photo")
        remove_photo = request.form.get("remove_photo") == "true"  # Convertir a booleano

        # Validar campos requeridos
        if not first_name:
            raise APIException('El campo "first_name" es requerido', status_code=400)
        if not email:
            raise APIException('El campo "email" es requerido', status_code=400)

        # Actualizar los campos básicos
        doctor.first_name = first_name
        doctor.last_name = last_name
        doctor.email = email
        doctor.phone_number = phone_number
        if password:
            doctor.password = password  # Asumiendo que tienes un método para hashear la contraseña

        # Manejar la foto de perfil
        if remove_photo:
            doctor.url = None  # Eliminar la foto estableciendo la URL como null
        elif file:
            # Subir la nueva foto a Cloudinary
            try:
                image_url = upload_image(file)
                doctor.url = image_url
            except Exception as e:
                raise APIException(f"Error al subir la imagen a Cloudinary: {str(e)}", status_code=500)

        db.session.commit()

        return jsonify({
            "msg": "Doctor actualizado exitosamente",
            "updated_doctor": doctor.serialize()
        }), 200

    except APIException as e:
        return jsonify({"msg": e.message}), e.status_code
    except Exception as e:
        return jsonify({"msg": f"Error interno del servidor: {str(e)}"}), 500

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

@api.route("/medical_centers", methods=["GET"])
def get_medical_centers():
    medical_centers = MedicalCenter.query.all()
    return jsonify([center.serialize() for center in medical_centers]), 200

# Agregar un nuevo centro médico
@api.route("/medical_centers", methods=["POST"])
def create_medical_center():
    try:
        print("Solicitud recibida en POST /api/medical_centers")
        print("Contenido de request.files:", request.files)
        print("Contenido de request.form:", request.form)

        # Verificar si se envió un archivo
        file = request.files.get("image")
        image_url = None
        if file:
            print("Subiendo imagen a Cloudinary...")
            image_url = upload_medical_center_image(file)
            print(f"Imagen subida, URL: {image_url}")
        else:
            print("No se envió ninguna imagen")

        # Obtener los datos del formulario
        data = request.form
        name = data.get("name")
        address = data.get("address")
        country = data.get("country")
        city = data.get("city")
        phone = data.get("phone")
        email = data.get("email")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        print(f"Datos del formulario: name={name}, address={address}, country={country}, city={city}, phone={phone}, email={email}, latitude={latitude}, longitude={longitude}")

        if not all([name, address, country, city, phone, email]):
            print("Faltan campos requeridos")
            return jsonify({"msg": "Missing required fields"}), 400

        try:
            latitude = float(latitude) if latitude else None
            longitude = float(longitude) if longitude else None
        except (ValueError, TypeError) as e:
            print(f"Error al convertir latitud/longitud: {str(e)}")
            return jsonify({"msg": "Invalid latitude or longitude"}), 400

        new_center = MedicalCenter(
            name=name,
            address=address,
            country=country,
            city=city,
            phone=phone,
            email=email,
            latitude=latitude,
            longitude=longitude,
            image_url=image_url
        )
        print("Guardando centro médico en la base de datos...")
        db.session.add(new_center)
        db.session.commit()
        print("Centro médico creado exitosamente")
        return jsonify(new_center.serialize()), 201

    except Exception as e:
        print(f"Error en create_medical_center: {str(e)}")
        db.session.rollback()
        return jsonify({"msg": f"Error creating medical center: {str(e)}"}), 500

# Actualizar un centro médico
@api.route("/medical_centers/<int:id>", methods=["PUT"])
def update_medical_center(id):
    center = MedicalCenter.query.get(id)
    if not center:
        return jsonify({"msg": "Medical center not found"}), 404

    # Verificar si se quiere eliminar la imagen
    remove_image = request.form.get("remove_image") == "true"
    if remove_image and center.image_url:
        delete_image(center.image_url)
        center.image_url = None

    # Verificar si se subió una nueva imagen
    file = request.files.get("image")
    if file:
        if center.image_url:  # Eliminar la imagen anterior si existe
            delete_image(center.image_url)
        center.image_url = upload_medical_center_image(file)

    # Actualizar los datos del formulario
    data = request.form
    center.name = data.get("name", center.name)
    center.address = data.get("address", center.address)
    center.country = data.get("country", center.country)
    center.city = data.get("city", center.city)
    center.phone = data.get("phone", center.phone)
    center.email = data.get("email", center.email)

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    try:
        center.latitude = float(latitude) if latitude else center.latitude
        center.longitude = float(longitude) if longitude else center.longitude
    except (ValueError, TypeError):
        return jsonify({"msg": "Invalid latitude or longitude"}), 400

    db.session.commit()
    return jsonify(center.serialize()), 200

@api.route("/medical_centers/<int:id>", methods=["DELETE"])
def delete_medical_center(id):
    center = MedicalCenter.query.get(id)
    if not center:
        return jsonify({"msg": "Medical center not found"}), 404

    # Eliminar la imagen de Cloudinary si existe
    if center.image_url:
        delete_image(center.image_url)

    db.session.delete(center)
    db.session.commit()
    return jsonify({"msg": "Medical center deleted"}), 200
#//////////////////////////////END //////Medical Center

########## Beguin patients services###############

@api.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([patient.serialize() for patient in patients]), 200
    
@api.route('/patients', methods=['POST'])
def create_patient():
    try:
        # Obtener datos del formulario (multipart/form-data)
        email = request.form.get("email")
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        gender = request.form.get("gender")
        birth_date = request.form.get("birth_date")
        phone_number = request.form.get("phone_number")
        password = request.form.get("password")
        historial_clinico = request.form.get("historial_clinico", "")
        file = request.files.get("photo")

        # Validar campos requeridos
        required_fields = ['email', 'first_name', 'last_name', 'gender', 'birth_date', 'phone_number', 'password']
        for field in required_fields:
            if not request.form.get(field):
                raise APIException(f"Missing required field: {field}", status_code=400)

        # Validar formato de email
        if '@' not in email:
            raise APIException("Invalid email format", status_code=400)

        # Validar género
        if gender not in ['male', 'female']:
            raise APIException("Gender must be 'male' or 'female'", status_code=400)

        # Validar formato de fecha
        try:
            birth_date = datetime.strptime(birth_date, '%Y-%m-%d').date()
        except ValueError:
            raise APIException("Invalid birth_date format, use YYYY-MM-DD", status_code=400)

        # Verificar si el email ya existe
        if Patient.query.filter_by(email=email).first():
            raise APIException("Email already exists", status_code=400)

        # Subir la imagen a Cloudinary si se proporcionó
        image_url = None
        if file:
            try:
                image_url = upload_image(file)
            except Exception as e:
                raise APIException(f"Error uploading image to Cloudinary: {str(e)}", status_code=500)

        # Crear nuevo paciente
        new_patient = Patient(
            email=email,
            first_name=first_name,
            last_name=last_name,
            gender=gender,
            birth_date=birth_date,
            phone_number=phone_number,
            password=password,
            historial_clinico=historial_clinico,
            url=image_url
        )

        db.session.add(new_patient)
        db.session.commit()

        return jsonify(new_patient.serialize()), 201

    except APIException as e:
        return jsonify({"msg": e.message}), e.status_code
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating patient: {str(e)}"}), 500

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
@jwt_required()
def get_doctor_specialties():
    current_doctor_id = get_jwt_identity()  # Obtener el ID del doctor desde el token

    specialties_doctor = Specialties_doctor.query.filter_by(id_doctor=current_doctor_id).all()

    if not specialties_doctor:
        return jsonify({"msg": "No hay especialidades asociadas a este doctor"}), 404

    specialties_list = [
        {
            "id": sd.id,
            "id_specialty": sd.id_specialty,
            "name": Specialties.query.get(sd.id_specialty).name  # Obtener el nombre de la especialidad
        }
        for sd in specialties_doctor
    ]

    return jsonify({"specialties": specialties_list}), 200

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
@jwt_required()
def post_specialties_doctor():
    current_doctor_id = get_jwt_identity()
    data = request.get_json()
    if not data or 'id_specialty' not in data:
        raise APIException('El campo "id_specialty" es requerido', status_code=400)
    new_specialty_doctor = Specialties_doctor(
        id_specialty=data["id_specialty"],
        id_doctor=current_doctor_id
    )
    db.session.add(new_specialty_doctor)
    db.session.commit()
    return jsonify({"msg": "Se creó nueva especialidad", "new_Specialty_doctor": new_specialty_doctor.serialize()}), 201

#-------------------------------------DELETE----SPECIALTIES_DOCTOR-----------------------------------------------#

@api.route('/specialties_doctor/<int:specialty_id>', methods=['DELETE'])
@jwt_required()
def delete_specialty_doctor(specialty_id):
    specialty_doctor_one = Specialties_doctor.query.get(specialty_id)
    #doctor_id = get_jwt_identity()  # Obtener ID del doctor autenticado
    #specialty_doctor_one = Specialties_doctor.query.filter_by(id_specialty=specialty_id, id_doctor=int(doctor_id))
    #specialty_doctor_one = Specialties_doctor.query.filter_by(id_specialty=specialty_id, id_doctor=int(doctor_id)).first()

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
@jwt_required()
def post_appointment():
    data = request.get_json()
    patient_id = get_jwt_identity()

    # Validate required fields
    required_fields = [ 'id_doctor', 'id_center', 'date', 'hour', 'id_specialty']
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
    if not Patient.query.get(int(patient_id)):
        raise APIException("Patient not found", status_code=404)
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
        id_patient=int(patient_id),
        id_doctor=data["id_doctor"],
        id_center=data["id_center"],
        date=appointment_date,
        hour=appointment_hour,
        id_specialty=data["id_specialty"],
        confirmation=False
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
def get_get_profile_doctor():
    doctor_id = get_jwt_identity()  # Obtener ID del doctor autenticado
    doctor = Doctors.query.get(doctor_id)

    if not doctor:
        return jsonify({"error": "Doctor no encontrado"}), 404

    # Crear una lista de especialidades sin duplicados
    specialties = list({
        s.id_specialty: Specialties.query.get(s.id_specialty).name
        for s in doctor.specialties
    }.items())

    # Convertimos la lista de tuplas en una lista de diccionarios
    specialties = [{"id": s[0], "name": s[1]} for s in specialties]

    # Devolver la respuesta incluyendo el campo `has_specialties`
    return jsonify({
        "has_specialties": doctor.has_specialties,  # Nuevo campo que indica si tiene especialidades
        "specialties": specialties
    })

    # Obtener centros médicos y oficinas del doctor

    medical_centers = [
        {
            "id": mc.id_medical_center,
            "name": MedicalCenter.query.get(mc.id_medical_center).name,  # Obtener nombre del centro médico
            "office": mc.office  # Oficina asignada en ese centro
        }
        for mc in doctor.medical_center_doctors
    ]

    doctor_data = {
        "id": doctor.id,
        "email": doctor.email,
        "first_name": doctor.first_name,
        "last_name": doctor.last_name,
        "phone_number": doctor.phone_number,
        "url": doctor.url,  # Agregar el campo url
        "specialties": specialties,
        "medical_centers": medical_centers
    }

    return jsonify({
        "has_specialties": doctor.has_specialties,
        "doctor": doctor_data  # Envolver los datos del doctor en un objeto
    }), 200

#--------------------------------------TRaigo el API del Doctor con token para DashboardDoctor----------------------#


#/////////////////START/////////////////////////////////////////# DOCTORLOGIN///////////////////////////////////////////////

#//////////////////////////////START //////MEDICAL CENTER DOCTOR////////////////////////////////////////////////////////

#-------------------------------------GET-----ALL MEDICAL CENTER DOCTOR-----------------------------------------------#

@api.route("/medicalcenterdoctor", methods=["GET"])
@jwt_required()
def get_medical_center_doctor():
    # Lógica para obtener el id del doctor desde el token
    current_doctor_id = get_jwt_identity()

    data = MedicalCenterDoctor.query.filter_by(id_doctor=current_doctor_id).all()
    result = [item.serialize() for item in data]
    print(result)

    return jsonify({"data": result}), 200

#-------------------------------------------------POST------------------------------------------------#
#-------------------------------------POST----------------------------------------------------#
@api.route('/medicalcenterdoctor', methods=['POST'])
def post_medical_center_doctor():
    data = request.get_json()

    # Validaciones básicas
    if not data:
        raise APIException('No se proporcionaron datos', status_code=400)
    if 'id_medical_center' not in data or 'id_doctor' not in data:
        raise APIException('El campo "id_medical_center" y "id_doctor" es requerido', status_code=400)

    id_medical_center = data["id_medical_center"]
    id_doctor = data["id_doctor"]
    office = data.get("office")

    existing_entry = MedicalCenterDoctor.query.filter_by(
        id_medical_center=id_medical_center,
        id_doctor=id_doctor,
        office=office
    ).first()

    if existing_entry:
        raise APIException("Ya existe este centro médico con esa oficina asignada para este doctor.", status_code=400)

    # Crear nuevo registro si no existe duplicado
    new_medical_center_doctor = MedicalCenterDoctor(
        id_medical_center=id_medical_center,
        id_doctor=id_doctor,
        office=office,
    )

    db.session.add(new_medical_center_doctor)
    db.session.commit()

    response_body = {
        "msg": "Se creó nuevo medical_center_doctor",
        "new_medical_center_doctor": new_medical_center_doctor.serialize()
    }
    return jsonify(response_body), 201


#-------------------------------------DELETE---MEDICAL CENTER DOCTOR-----------------------------------------------#

@api.route("/medicalcenterdoctor/<int:cmd_id>", methods=["DELETE"])
@jwt_required()
def delete_medical_center_doctor(cmd_id):
    # Obtener el ID del doctor desde el token
    current_user_id = get_jwt_identity()

    # Buscar la relación por ID
    medical_center_doctor = MedicalCenterDoctor.query.get(cmd_id)

    if not medical_center_doctor:
        return jsonify({"msg": "Relación no encontrada"}), 404

    # Verificar que la relación pertenezca al doctor autenticado
    if medical_center_doctor.id_doctor != int(current_user_id):
        return jsonify({"msg": "No autorizado"}), 403

    # Eliminar si todo está correcto
    db.session.delete(medical_center_doctor)
    db.session.commit()
    return jsonify({"msg": "Centro eliminado correctamente"}), 200

#-------------------------------------PUT--MEDICAL CENTER DOCTOR----------------------------------------------#

@api.route("/medicalcenterdoctor/<int:cmd_id>", methods=["PUT"])
@jwt_required()
def update_medical_center_doctor(cmd_id):
    # Obtener el ID del doctor desde el token
    current_user_id = get_jwt_identity()

    # Buscar la relación por ID
    medical_center_doctor = MedicalCenterDoctor.query.get(cmd_id)

    if not medical_center_doctor:
        return jsonify({"msg": "Relación no encontrada"}), 404

    # Verificar que la relación pertenezca al doctor autenticado
    if medical_center_doctor.id_doctor != int(current_user_id):
        return jsonify({"msg": "No autorizado"}), 403

    # Obtener el nuevo número de oficina desde el cuerpo de la solicitud
    data = request.get_json()
    new_office = data.get("office")

    if not new_office:
        return jsonify({"msg": "El número de oficina es requerido"}), 400

    # Actualizar el número de oficina
    medical_center_doctor.office = new_office
    db.session.commit()

    return jsonify({"msg": "Número de oficina actualizado correctamente"}), 200


#--START------Nuevo BackEnd para add medical center y doctor desde el usuario Doctor//  REVISAR OSCAR//////////////////

@api.route('/add_medical_centers', methods=['POST'])
def add_medical_centers():
    # Obtener los datos del cuerpo de la solicitud
    data = request.get_json()

    # Validar que los datos necesarios estén presentes
    if not data:
        raise APIException('No se proporcionaron datos', status_code=400)
    
    if not isinstance(data, list):  # Asegúrate de que los datos sean una lista de objetos
        raise APIException('Los datos deben ser una lista de objetos', status_code=400)

    # Validar que cada objeto en la lista tenga los campos necesarios
    for item in data:
        if 'id_medical_center' not in item or 'id_doctor' not in item or 'office' not in item:
            raise APIException('Los campos "id_medical_center", "id_doctor" y "office" son requeridos en cada item', status_code=400)
        
        # Crear y agregar los registros a la base de datos
        new_medical_center_doctor = MedicalCenterDoctor(
            id_medical_center=item["id_medical_center"],
            id_doctor=item["id_doctor"],
            office=item["office"]
        )
        db.session.add(new_medical_center_doctor)
    
    # Guardar todos los cambios en la base de datos
    db.session.commit()

    # Devolver una respuesta con el nuevo registro creado
    response_body = {
        "msg": "Se crearon nuevos registros en MedicalCenterDoctor",
        "new_medical_center_doctors": [new_medical_center_doctor.serialize() for new_medical_center_doctor in data]
    }
    return jsonify(response_body), 201

#--END-----Nuevo BackEnd para add medical center y doctor desde el usuario Doctor//


#---------------oscar---------------------------------------------------------------------04-04
@api.route('/paneldoctor', methods=['GET'])
@jwt_required()
def get_doctor_panel():
    doctor_id = get_jwt_identity()  # Obtener ID del doctor desde el JWT
    doctor = Doctors.query.get(doctor_id)  # Usar "Doctors" en lugar de "Doctor"

    if not doctor:
        return jsonify({"error": "Doctor no encontrado"}), 404

    # Obtener especialidades del doctor
    specialties = [
        {"id": s.id_specialty, "name": Specialties.query.get(s.id_specialty).name}
        for s in doctor.specialties
    ]

    # Obtener centros médicos del doctor
    medical_centers = [
        {
            "id": m.id,
            "id_medical_center": m.id_medical_center,
            "name": MedicalCenter.query.get(m.id_medical_center).name,
            "office": m.office
        }
        for m in doctor.medical_center_doctors
    ]

    # Estructura de datos para enviar al frontend
    data = {
        "doctor": {
            "id": doctor.id,
            "email": doctor.email,
            "first_name": doctor.first_name,
            "last_name": doctor.last_name,
            "phone_number": doctor.phone_number,
            "url": doctor.url,
            "has_specialties": bool(specialties),
            "has_medical_centers": bool(medical_centers),
            "specialties": specialties,
            "medical_centers": medical_centers
        }
    }

    return jsonify(data), 200
#-------
# ------------ PANEL DEL PACIENTE ------------
@api.route('/panelpatient', methods=['GET'])
@jwt_required()
def get_patient_panel():
    try:
        patient_id = get_jwt_identity()
        patient = Patient.query.get(patient_id) # Usar Patient

        if not patient:
            return jsonify({"error": "Paciente no encontrado"}), 404

        data = {
            "patient": {
                "id": patient.id,
                "email": patient.email,
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "phone_number": patient.phone_number,
                "appointments": [appointment.serialize() for appointment in patient.appointments] if hasattr(patient, 'appointments') else []
            }
        }

        return jsonify(data), 200
    except Exception as e:
        print(f"Error in get_patient_panel: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
# ------------ END PANEL DEL PACIENTE ------------

@api.route('/specialties_doctor/<int:specialty_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor_specialty(specialty_id):
    print(f"Solicitud DELETE recibida para la especialidad {specialty_id}")  # Verifica que la ruta se está alcanzando
    current_user_id = get_jwt_identity()  # Obtener el ID del doctor autenticado
    print(f"Doctor ID desde el token: {current_user_id}") 
    specialty = Specialties_doctor.query.filter_by(
        id_doctor=current_user_id, 
        id_specialty=specialty_id
    ).first()


    if not specialty:
        return jsonify({"msg": "Especialidad no encontrada o no pertenece al doctor"}), 404

    try:
        db.session.delete(specialty)
        db.session.commit()
        return jsonify({"msg": "Especialidad eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar la especialidad", "error": str(e)}), 500

#####################-------------------------------------------

@api.route('/doctor_offices', methods=['GET'])
@jwt_required()
def get_doctor_offices():
    current_user_id = get_jwt_identity()  # Obtener el ID del doctor autenticado
    doctor_offices = MedicalCenterDoctor.query.filter_by(id_doctor=current_user_id).all()  # Obtener las oficinas del doctor

    if not doctor_offices:
        return jsonify({"msg": "El doctor no tiene oficinas asignadas."}), 404

    return jsonify([office.serialize() for office in doctor_offices]), 200

#####################-------------------------------------------
@api.route('/medicalcenterdoctor', methods=['POST'])
@jwt_required()
def add_medical_center_doctor():
    current_user_id = get_jwt_identity()  # Obtener el ID del doctor autenticado
    data = request.get_json()
    id_medical_center = data.get('id_medical_center')
    office = data.get('office')

    # Verificar que el centro médico y oficina son válidos
    medical_center = MedicalCenter.query.get(id_medical_center)
    if not medical_center:
        return jsonify({"msg": "Centro médico no encontrado"}), 404

    new_entry = MedicalCenterDoctor(id_medical_center=id_medical_center, id_doctor=current_user_id, office=office)

    try:
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({"msg": "Centro médico y oficina agregados correctamente", "MedicalCenterDoctor": new_entry.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al agregar centro médico", "error": str(e)}), 500


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

######################Beguin services  Google Gen AI###########################
@api.route('/patient/ai-consultation', methods=['POST'])
@jwt_required()
def ai_consultation():
    try:
        import unicodedata
        from datetime import datetime
        import logging

        # Configurar logging para depuración
        logging.basicConfig(level=logging.DEBUG)
        logger = logging.getLogger(__name__)

        # Función para normalizar texto (eliminar tildes y otros diacríticos)
        def normalize_text(text):
            text = ''.join(c for c in unicodedata.normalize('NFKD', text) if unicodedata.category(c) != 'Mn')
            return text.lower().strip()

        patient_id = get_jwt_identity()
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({"msg": "Paciente no encontrado"}), 404

        data = request.get_json()
        if not data or 'symptoms' not in data:
            return jsonify({"msg": "Se requieren síntomas"}), 400

        symptoms = data['symptoms']
        normalized_symptoms = normalize_text(symptoms)

        # Detección especial de infancia
        child_keywords = ["niño", "niña", "hijo", "hija", "bebé", "bebe", "infante", "mi hijo", "mi bebé", "mi bebe"]
        is_child_related = any(kw in normalized_symptoms for kw in child_keywords)

        # Mapeo de respaldo para casos obvios (red de seguridad)
        backup_mapping = {
            "testiculo": {"specialty": "Urólogo", "recommendation": "Te recomendamos descansar y evitar actividades que puedan empeorar el dolor mientras buscas atención."},
            "diabetes": {"specialty": "Endocrinólogo", "recommendation": "Te recomendamos controlar tu dieta y monitorear tus niveles de glucosa mientras buscas atención."},
            "amigdalitis": {"specialty": "Otorrinolaringólogo", "recommendation": "Te recomendamos hacer gárgaras con agua tibia y sal mientras buscas atención médica."},
            "hombro": {"specialty": "Traumatólogo", "recommendation": "Te recomendamos inmovilizar la zona afectada y evitar movimientos bruscos mientras buscas atención."},
        }

        # Determinar la especialidad y recomendación
        specialty = None
        recommendation = None

        if is_child_related:
            specialty = "Pediatra"
            recommendation = "Te recomendamos observar con atención los síntomas y mantener al niño bien hidratado y en reposo si es necesario."
        else:
            # Primero verificamos si hay un caso obvio en el mapeo de respaldo
            found_in_backup = False
            for symptom_key, info in backup_mapping.items():
                if symptom_key in normalized_symptoms:
                    specialty = info["specialty"]
                    recommendation = info["recommendation"]
                    found_in_backup = True
                    logger.debug(f"Encontrado en mapeo de respaldo: {symptom_key} -> {specialty}")
                    break

            # Si no se encuentra en el mapeo de respaldo, consultamos a la IA
            if not found_in_backup:
                today = datetime.now()
                birth_date = patient.birth_date
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

                prompt = f"""
                Eres un asistente de IA diseñado para dar recomendaciones generales de salud y sugerir una única especialidad médica basada en síntomas o enfermedades mencionadas. No eres un médico, y tus respuestas deben ser informativas, no diagnósticas. Usa esta información del paciente:
                - Edad: {age} años
                - Género: {patient.gender}
                - Historial clínico: {patient.historial_clinico or 'No disponible'}
                - Información reportada: {symptoms}

                El usuario puede mencionar síntomas (como "me duele un testículo") o enfermedades (como "tengo diabetes"). Si se menciona una enfermedad, prioriza esa información para seleccionar la especialidad más adecuada. Si solo se mencionan síntomas, selecciona la especialidad más relevante según los síntomas. Usa nombres de especialidades comunes y ampliamente reconocidos (por ejemplo, "Cardiólogo" en lugar de "Especialista en Cardiología Pediátrica"). **No sugieras "Médico General" a menos que no exista una especialidad más específica que se ajuste claramente a la información proporcionada.**

                **Instrucción sobre el historial clínico:** Solo menciona el historial clínico en tu respuesta si está claramente relacionado con los síntomas o la enfermedad reportada. Por ejemplo, si el historial menciona "varicocele" y el usuario reporta "me duele un testículo", puedes mencionarlo porque está relacionado. Pero si el usuario reporta "me falla la memoria", no menciones el historial de "varicocele" porque no tiene relación. Si el historial no es relevante, omítelo por completo en tu respuesta.

                **Ejemplos de síntomas/enfermedades y especialidades esperadas:**
                - "Me duele un testículo" -> Urólogo
                - "Tengo diabetes" -> Endocrinólogo
                - "Me disloqué un hombro" -> Traumatólogo
                - "Necesito operarme de amigdalitis" -> Otorrinolaringólogo
                - "Me duele el hombro" -> Traumatólogo u Ortopedista
                - "Tengo mareos" -> Neurólogo
                - "Tengo alergias" -> Alergólogo
                - "Tengo hipertensión" -> Cardiólogo
                - "Tengo asma" -> Neumólogo
                - "Tengo dermatitis" -> Dermatólogo
                - "Tengo anemia" -> Hematólogo
                - "Me duele el hígado" -> Hepatólogo
                - "Me falla la memoria" -> Neurólogo

                Responde en español con lo siguiente en un solo párrafo fluido, sin números, listas ni repeticiones:
                - Una recomendación general breve y completa (1-2 frases) como descansar o hidratarse.
                - Una sola especialidad médica específica, integrada naturalmente en el texto con la frase "te recomendamos consultar con un".
                Usa un tono amigable y claro, completa todas las frases y evita ambigüedades o cortes.
                """

                try:
                    response = client.generate_content(
                        prompt,
                        generation_config=types.GenerationConfig(
                            max_output_tokens=150,
                            temperature=0.1,  # Respuestas más determinísticas
                        )
                    )
                    gemini_response = response.text.strip()
                    logger.debug(f"Respuesta completa de Gemini: '{gemini_response}'")

                    # Extraer la especialidad y la recomendación
                    specialty_marker = "te recomendamos consultar con un "
                    if specialty_marker in gemini_response:
                        start_idx = gemini_response.index(specialty_marker) + len(specialty_marker)
                        specialty_end = gemini_response.find(".", start_idx)
                        if specialty_end == -1:
                            specialty_end = None
                        specialty = gemini_response[start_idx:specialty_end].strip().capitalize()
                        recommendation = gemini_response[:start_idx - len(specialty_marker)].strip()

                        logger.debug(f"Especialidad extraída: '{specialty}'")
                        logger.debug(f"Recomendación extraída: '{recommendation}'")

                    else:
                        logger.debug("No se encontró el marcador 'te recomendamos consultar con un' en la respuesta de Gemini.")
                        return jsonify({"msg": "No se pudo determinar una especialidad adecuada. Te recomendamos buscar ayuda con un Medico General que te proporcione pasos a seguir."}), 400

                except Exception as e:
                    logger.error(f"Error al consultar Gemini: {str(e)}")
                    return jsonify({"msg": "Error al procesar la consulta. Te recomendamos buscar ayuda médica general."}), 500

        logger.debug(f"Especialidad final: {specialty}")

        # Buscar la especialidad en la base de datos (sin mapeo estricto)
        doctors = []
        if specialty:
            normalized_db_specialty_name = normalize_text(specialty)
            # Buscar coincidencias parciales o exactas en la base de datos
            specialty_obj = Specialties.query.filter(db.func.lower(Specialties.name).like(f"%{normalized_db_specialty_name}%")).first()
            if specialty_obj:
                specialty_doctors = Specialties_doctor.query.filter_by(id_specialty=specialty_obj.id).all()
                for sd in specialty_doctors:
                    doctor = Doctors.query.get(sd.id_doctor)
                    if doctor:
                        doctors.append(doctor.serialize())
            else:
                logger.debug(f"No se encontró la especialidad '{specialty}' en la base de datos.")

        doctor_names = ", ".join([f"{d['first_name']} {d['last_name']}" for d in doctors]) if doctors else None

        # Construir la respuesta sin incluir el enlace como HTML
        recommendation_text = (
            f"Hola! {recommendation} Basado en lo que nos cuentas ('{symptoms}'), te recomendamos consultar con un {specialty}."
        )

        # Devolver el texto de la recomendación y el enlace por separado
        return jsonify({
            "recommendation": recommendation_text,
            "link": {
                "text": "Puedes agendar una cita con uno de nuestros profesionales haciendo clic aquí.",
                "url": "/search-professionals"
            },
            "specialty": specialty,
            "doctors": doctors
        }), 200

    except Exception as e:
        logger.error(f"Error al consultar: {str(e)}")
        return jsonify({"msg": f"Error al consultar: {str(e)}"}), 500

    ######################End services  Google Gen AI###########################


######################### GET TO LOCATION MEDICAL CENTER #########oscar 07-04-2025 ############
@api.route("/medical_centers/locations", methods=["GET"])
def get_medical_center_locations():
    centers = MedicalCenter.query.with_entities(
    MedicalCenter.city, MedicalCenter.address, MedicalCenter.country
).distinct().all()

    # Eliminar duplicados manualmente si es necesario
    unique_locations = []
    seen = set()

    for center in centers:
        key = (center.city, center.address, center.country)
        if key not in seen:
            seen.add(key)
            unique_locations.append({
                "city": center.city,
                "address": center.address,
                "country": center.country
            })

    return jsonify(unique_locations), 200


######################### GET TO DATOS DOCTOR ######### oscar 07-04-2025 ############

@api.route('/professionals/search', methods=['GET'])
def get_doctors_panel():
    country = request.args.get('country')
    specialty_name = request.args.get('specialty')
    city = request.args.get('city')

    doctors = Doctors.query.all()
    if not doctors:
        return jsonify({"error": "No se encontraron doctores"}), 404

    doctor_data = []

    for doctor in doctors:
        specialties = [
            {"id": s.id_specialty, "name": Specialties.query.get(s.id_specialty).name}
            for s in doctor.specialties
        ]

        if specialty_name and not any(s['name'].lower() == specialty_name.lower() for s in specialties):
            continue

        # Agrupar centros médicos únicos por id_medical_center
        unique_centers = {}
        for mcd in doctor.medical_center_doctors:
            mc = MedicalCenter.query.get(mcd.id_medical_center)
            if not mc:
                continue
            if mc.id not in unique_centers:
                unique_centers[mc.id] = {
                    "id": mcd.id,
                    "id_medical_center": mc.id,
                    "name": mc.name,
                    "address": mc.address,
                    "city": mc.city,
                    "country": mc.country,
                    "office": mcd.office
                }

        medical_centers = list(unique_centers.values())

        if country and not any(mc['country'].lower() == country.lower() for mc in medical_centers):
            continue

        if city and not any(mc['city'].lower() == city.lower() for mc in medical_centers):
            continue

        doctor_info = {
            "id": doctor.id,
            "email": doctor.email,
            "first_name": doctor.first_name,
            "last_name": doctor.last_name,
            "phone_number": doctor.phone_number,
            "url": doctor.url,
            "has_specialties": bool(specialties),
            "has_medical_centers": bool(medical_centers),
            "specialties": specialties,
            "medical_centers": medical_centers
        }

        doctor_data.append(doctor_info)

    return jsonify({"doctors": doctor_data}), 200



@api.route('/doctor/profile', methods=['PUT'])
@jwt_required()
def update_doctor_profile():
    doctor_id = get_jwt_identity()  # Obtener el ID del doctor desde el token JWT
    doctor = Doctors.query.get(doctor_id)  # Usar "Doctors" en lugar de "Doctor"

    if not doctor:
        return jsonify({"msg": "Doctor no encontrado"}), 404

    data = request.form  # Usar request.form para manejar FormData

    # Actualizar los campos si están presentes en el formulario
    doctor.first_name = data.get('first_name', doctor.first_name)
    doctor.last_name = data.get('last_name', doctor.last_name)
    doctor.email = data.get('email', doctor.email)
    doctor.phone_number = data.get('phone_number', doctor.phone_number)

    # Actualizar contraseña si se proporciona
    if 'password' in data and data['password']:
        doctor.password = data['password']  # Nota: Deberías hashear la contraseña aquí si es necesario

    # Manejar la foto de perfil
    if 'photo' in request.files:
        photo = request.files['photo']
        if photo:
            upload_result = cloudinary.uploader.upload(photo)
            doctor.url = upload_result['secure_url']
    elif data.get('remove_photo') == 'true' and doctor.url:
        doctor.url = None  # Eliminar la foto si se solicita

    try:
        db.session.commit()
        return jsonify({"updated_doctor": doctor.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el perfil: " + str(e)}), 500
    





