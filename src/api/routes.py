"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, MedicalCenter, Patient, Doctors
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
