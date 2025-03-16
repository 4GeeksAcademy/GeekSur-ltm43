
import click
from api.models import db, User, Patient
from datetime import datetime  # Importa el módulo datetime


"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
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
                    phone_number=str(patient_data["phone_number"]),  # Forzar string
                    password=patient_data["password"]
                )
                db.session.add(patient)
            db.session.commit()
            print("All test patients inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting patients: {str(e)}")
            raise
        