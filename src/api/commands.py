import click
from api.models import db, User, Patient, MedicalCenter
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