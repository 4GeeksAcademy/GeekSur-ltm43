from flask import Blueprint, request, jsonify
from api.models import db, MedicalCenter

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