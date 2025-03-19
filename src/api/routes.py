# routes.py
from flask import Blueprint, request, jsonify
from api.models import db, MedicalCenter, Patient
from api.utils import APIException
from datetime import datetime

api = Blueprint('api', __name__)


# Obtener todos los centros médicos
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

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/patients', methods=['GET'])
def get_patients():
    try:
        patients = Patient.query.all()
        return jsonify([patient.serialize() for patient in patients]), 200
    except Exception as e:
        print(f"Error al listar pacientes: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/patients', methods=['POST'])
def create_patient():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)
        birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()  # Convertir cadena a date
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
    except Exception as e:
        print(f"Error al crear paciente: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@api.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):
    try:
        # Busca el paciente por ID
        patient = Patient.query.get_or_404(id)
        
        # Obtiene los datos enviados desde el frontend
        data = request.get_json()
        print("Datos recibidos para actualizar:", data)  # Para depurar
        
        # Validaciones básicas
        required_fields = ['email', 'first_name', 'last_name', 'gender', 'birth_date', 'phone_number', 'password']
        for field in required_fields:
            if field not in data:
                raise APIException(f"Missing required field: {field}", status_code=400)
        
        # Actualiza los campos del paciente
        patient.email = data['email']
        patient.first_name = data['first_name']
        patient.last_name = data['last_name']
        patient.gender = data['gender']
        patient.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
        patient.phone_number = data['phone_number']
        patient.password = data['password']  # Actualizamos el password si se envía
        
        db.session.commit()
        return jsonify(patient.serialize()), 200
    except APIException as e:
        return jsonify({"error": str(e)}), e.status_code
    except Exception as e:
        print(f"Error al actualizar paciente: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    # Busca el paciente por ID
    patient = Patient.query.get_or_404(id)
    
    # Elimina el paciente de la base de datos
    db.session.delete(patient)
    db.session.commit()
    
    # Retorna una respuesta vacía con código 200
    return jsonify({"message": f"Patient with id {id} has been deleted"}), 200