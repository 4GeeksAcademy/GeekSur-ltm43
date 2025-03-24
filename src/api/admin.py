import os
from flask_admin import Admin
from .models import db, User, Patient, MedicalCenter,Doctors , Specialties, Specialties_doctor
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Patient, db.session)) 
    admin.add_view(ModelView(MedicalCenter, db.session))   
    admin.add_view(ModelView(Doctors, db.session))  
    admin.add_view(ModelView(Specialties, db.session))  
    admin.add_view(ModelView(Specialties_doctor, db.session))   
