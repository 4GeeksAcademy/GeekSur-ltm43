"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Doctors
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

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