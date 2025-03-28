from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "gender": self.gender,
            "birth_date": self.birth_date.strftime('%Y-%m-%d'),
            "phone_number": self.phone_number
            # Password excluido por seguridad
        }

class MedicalCenter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "country": self.country,
            "city": self.city,
            "phone": self.phone,
            "email": self.email
        }

class Doctors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    phone_number = db.Column(db.String(80), unique=False, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    specialties = db.relationship('Specialties_doctor', backref='doctor')


    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number":self.phone_number
                 
        } 
    
class Specialties(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    relation_specialties = db.relationship('Specialties_doctor', backref='Specialties')

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name ,
            "specialties": [{**specialties_doctor.serialize(),"specialty_name": self.name} for specialties_doctor in self.relation_specialties]          
        } 

class Specialties_doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_specialty = db.Column(db.Integer, db.ForeignKey('specialties.id'), nullable=False)
    id_doctor = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)

    def serialize(self):
        doctor_info = Doctors.query.get(self.id_doctor)
    
        return {
            "id": self.id,
            "id_specialty": self.id_specialty,    
            "info_doctor": doctor_info.serialize()             
        }
    
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_patient = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    id_doctor = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    id_center = db.Column(db.Integer, db.ForeignKey('medical_center.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Time, nullable=False)
    id_specialty = db.Column(db.Integer, db.ForeignKey('specialties.id'), nullable=False)
    confirmation = db.Column(db.String(20), nullable=False, default='to_be_confirmed')

    def serialize(self):
        return {
            "id": self.id,
            "id_patient": self.id_patient,
            "id_doctor": self.id_doctor,
            "id_center": self.id_center,
            "date": self.date.strftime('%Y-%m-%d'),
            "hour": self.hour.strftime('%H:%M'),
            "id_specialty": self.id_specialty,
            "confirmation": self.confirmation
        }
    
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_doctor = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    id_patient = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    id_center = db.Column(db.Integer, db.ForeignKey('medical_center.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.String(255))

    def serialize(self):
        return {
            "id": self.id,
            "id_doctor": self.id_doctor,
            "id_patient": self.id_patient,
            "date": self.date.strftime('%Y-%m-%d'),
            "id_center": self.id_center,
            "rating": self.rating,
            "comments": self.comments
        }