"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, MedicalCenter, Patient
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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