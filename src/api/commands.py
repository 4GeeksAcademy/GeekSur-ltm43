import click
from api.models import db, User, Patient, MedicalCenter, Appointment, Doctors, Specialties
from datetime import datetime

def setup_commands(app):
    
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Inserting test data for Patients")
        patients_data = [
            {
                "id": 5,
                "email": "glopez@gmail.com",
                "first_name": "Guillermo",
                "last_name": "Lopez",
                "gender": "male",
                "birth_date": datetime.strptime("2001-04-12", "%Y-%m-%d"),
                "phone_number": "4120968200",
                "password": "guille22"
            },
            {
                "id": 6,
                "email": "vero.martin@gmail.com",
                "first_name": "Veronica",
                "last_name": "Martinez",
                "gender": "female",
                "birth_date": datetime.strptime("1989-05-05", "%Y-%m-%d"),
                "phone_number": "4249868415",
                "password": "veroismy"
            },
            {
                "id": 7,
                "email": "mcrisafi02@gmail.com",
                "first_name": "Monica",
                "last_name": "Crisafi",
                "gender": "female",
                "birth_date": datetime.strptime("1992-07-03", "%Y-%m-%d"),
                "phone_number": "4120864548",
                "password": "crisafmy"
            }
        ]

        try:
            for patient_data in patients_data:
                patient = Patient(
                    id=patient_data["id"],
                    email=patient_data["email"],
                    first_name=patient_data["first_name"],
                    last_name=patient_data["last_name"],
                    gender=patient_data["gender"],
                    birth_date=patient_data["birth_date"],
                    phone_number=str(patient_data["phone_number"]),
                    password=patient_data["password"]
                )
                db.session.add(patient)
            db.session.commit()
            print("All test patients inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting patients: {str(e)}")
            raise

    @app.cli.command("insert-test-medical-centers")
    def insert_test_medical_centers():
        print("Inserting test data for Medical Centers")
        medical_centers_data = [
            {
                "id": 30,
                "name": "Clinica Caracas",
                "address": "Centro de Caracas",
                "country": "Venezuela",
                "city": "Caracas",
                "phone": "582198592475",
                "email": "clinccrcs@gmail.com"
            },
            {
                "id": 31,
                "name": "Clinica Santiago",
                "address": "Centro de Santiago",
                "country": "Chile",
                "city": "Santiago",
                "phone": "56235885585",
                "email": "clinccsgo@gmail.com"
            },
            {
                "id": 32,
                "name": "Clinica Auckland",
                "address": "Centro de Auckland",
                "country": "New Zealand",
                "city": "Auckland",
                "phone": "64205879736",
                "email": "clinccakl@gmail.com"
            }
        ]

        try:
            for center_data in medical_centers_data:
                center = MedicalCenter(
                    id=center_data["id"],
                    name=center_data["name"],
                    address=center_data["address"],
                    country=center_data["country"],
                    city=center_data["city"],
                    phone=center_data["phone"],
                    email=center_data["email"]
                )
                db.session.add(center)
            db.session.commit()
            print("All test medical centers inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting medical centers: {str(e)}")
            raise

    @app.cli.command("insert-test-doctors")
    def insert_test_doctors():
        print("Inserting test data for Doctors")
        doctors_data = [
            {
                "id": 10,
                "email": "dr.smith@gmail.com",
                "first_name": "John",
                "last_name": "Smith",
                "phone_number": "5551234567",
                "password": "docsmith123",
                "is_active": True
            },
            {
                "id": 11,
                "email": "dr.jones@gmail.com",
                "first_name": "Emily",
                "last_name": "Jones",
                "phone_number": "5559876543",
                "password": "docjones123",
                "is_active": True
            },
            {
                "id": 12,
                "email": "dr.brown@gmail.com",
                "first_name": "Michael",
                "last_name": "Brown",
                "phone_number": "5554567890",
                "password": "docbrown123",
                "is_active": True
            }
        ]

        try:
            for doctor_data in doctors_data:
                doctor = Doctors(
                    id=doctor_data["id"],
                    email=doctor_data["email"],
                    first_name=doctor_data["first_name"],
                    last_name=doctor_data["last_name"],
                    phone_number=doctor_data["phone_number"],
                    password=doctor_data["password"],
                    is_active=doctor_data["is_active"]
                )
                db.session.add(doctor)
            db.session.commit()
            print("All test doctors inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting doctors: {str(e)}")
            raise

    @app.cli.command("insert-test-specialties-and-appointments")
    def insert_test_specialties_and_appointments():
        print("Inserting test data for Specialties and Appointments")

        # Insert specialties first
        specialties_data = [
            {"id": 1, "name": "urology"},
            {"id": 2, "name": "cardiology"},
            {"id": 3, "name": "gynecology"}
        ]

        try:
            for specialty_data in specialties_data:
                specialty = Specialties(
                    id=specialty_data["id"],
                    name=specialty_data["name"]
                )
                db.session.add(specialty)
            db.session.commit()
            print("All test specialties inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting specialties: {str(e)}")
            raise

        # Fetch existing patients, doctors, and medical centers
        patients = Patient.query.all()
        doctors = Doctors.query.all()
        medical_centers = MedicalCenter.query.all()

        # Check if there are enough patients, doctors, and medical centers
        if len(patients) < 3:
            raise Exception("Not enough patients in the database. Please run 'insert-test-data' first.")
        if len(doctors) < 3:
            raise Exception("Not enough doctors in the database. Please run 'insert-test-doctors' first.")
        if len(medical_centers) < 3:
            raise Exception("Not enough medical centers in the database. Please run 'insert-test-medical-centers' first.")

        # Insert appointments using dynamic IDs
        appointments_data = [
            {
                "id": 20,
                "id_patient": patients[0].id,  # First patient
                "id_doctor": doctors[0].id,    # First doctor
                "id_center": medical_centers[0].id,  # First medical center
                "date": datetime.strptime("15-09-2025", "%d-%m-%Y").date(),
                "hour": datetime.strptime("13:00", "%H:%M").time(),
                "id_specialty": 1,  # urology
                "confirmation": "confirmed"
            },
            {
                "id": 21,
                "id_patient": patients[1].id,  # Second patient
                "id_doctor": doctors[1].id,    # Second doctor
                "id_center": medical_centers[1].id,  # Second medical center
                "date": datetime.strptime("18-09-2025", "%d-%m-%Y").date(),
                "hour": datetime.strptime("10:00", "%H:%M").time(),
                "id_specialty": 2,  # cardiology
                "confirmation": "confirmed"
            },
            {
                "id": 22,
                "id_patient": patients[2].id,  # Third patient
                "id_doctor": doctors[2].id,    # Third doctor
                "id_center": medical_centers[2].id,  # Third medical center
                "date": datetime.strptime("17-09-2025", "%d-%m-%Y").date(),
                "hour": datetime.strptime("15:00", "%H:%M").time(),
                "id_specialty": 3,  # gynecology
                "confirmation": "to_be_confirmed"
            }
        ]

        try:
            for appointment_data in appointments_data:
                appointment = Appointment(
                    id=appointment_data["id"],
                    id_patient=appointment_data["id_patient"],
                    id_doctor=appointment_data["id_doctor"],
                    id_center=appointment_data["id_center"],
                    date=appointment_data["date"],
                    hour=appointment_data["hour"],
                    id_specialty=appointment_data["id_specialty"],
                    confirmation=appointment_data["confirmation"]
                )
                db.session.add(appointment)
            db.session.commit()
            print("All test appointments inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting appointments: {str(e)}")
            raise