import click
from api.models import db, User, Patient, MedicalCenter, Appointment, Doctors, Specialties, Review 
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
                
                "email": "glopez@gmail.com",
                "first_name": "Guillermo",
                "last_name": "Lopez",
                "gender": "male",
                "birth_date": datetime.strptime("2001-04-12", "%Y-%m-%d"),
                "phone_number": "4120968200",
                "password": "1234"
            },
            {
                
                "email": "vero.martin@gmail.com",
                "first_name": "Veronica",
                "last_name": "Martinez",
                "gender": "female",
                "birth_date": datetime.strptime("1989-05-05", "%Y-%m-%d"),
                "phone_number": "4249868415",
                "password": "1234"
            },
            {
                
                "email": "mcrisafi02@gmail.com",
                "first_name": "Monica",
                "last_name": "Crisafi",
                "gender": "female",
                "birth_date": datetime.strptime("1992-07-03", "%Y-%m-%d"),
                "phone_number": "4120864548",
                "password": "1234"
            }
        ]

        try:
            for patient_data in patients_data:
                patient = Patient(
                    
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
                
                "name": "Clinica Caracas",
                "address": "Centro de Caracas",
                "country": "Venezuela",
                "city": "Caracas",
                "phone": "582198592475",
                "email": "clinccrcs@gmail.com",
                "latitude": "10.71783",
                "longitude": "-71.62159"
            },
            {
                
                "name": "Clinica Santiago",
                "address": "Centro de Santiago",
                "country": "Chile",
                "city": "Santiago",
                "phone": "56235885585",
                "email": "clinccsgo@gmail.com",
                "latitude": "33.43701593956523",
                "longitude": "-70.62458515168339"

            },
            {
                
                "name": "Clinica Auckland",
                "address": "Centro de Auckland",
                "country": "New Zealand",
                "city": "Auckland",
                "phone": "64205879736",
                "email": "clinccakl@gmail.com",
                "latitude": "46.43719863891602",
                "longitude": "168.35899353027344"
            }
        ]

        try:
            for center_data in medical_centers_data:
                center = MedicalCenter(
                    
                    name=center_data["name"],
                    address=center_data["address"],
                    country=center_data["country"],
                    city=center_data["city"],
                    phone=center_data["phone"],
                    email=center_data["email"],
                    latitude=center_data["latitude"],
                    longitude=center_data["longitude"]
                )
                db.session.add(center)
            db.session.commit()
            print("All test medical centers inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting medical centers: {str(e)}")
            raise

    # @app.cli.command("insert-test-medical-centers")
    # def insert_test_medical_centers():
    #     print("Inserting test data for Medical Centers")
    #     medical_centers_data = [
    #         {
                
    #             "name": "Clinica Caracas",
    #             "address": "Centro de Caracas",
    #             "country": "Venezuela",
    #             "city": "Caracas",
    #             "phone": "582198592475",
    #             "email": "clinccrcs@gmail.com"
    #         },
    #         {
                
    #             "name": "Clinica Santiago",
    #             "address": "Centro de Santiago",
    #             "country": "Chile",
    #             "city": "Santiago",
    #             "phone": "56235885585",
    #             "email": "clinccsgo@gmail.com"
    #         },
    #         {
                
    #             "name": "Clinica Auckland",
    #             "address": "Centro de Auckland",
    #             "country": "New Zealand",
    #             "city": "Auckland",
    #             "phone": "64205879736",
    #             "email": "clinccakl@gmail.com"
    #         }
    #     ]

    #     try:
    #         for center_data in medical_centers_data:
    #             center = MedicalCenter(
                    
    #                 name=center_data["name"],
    #                 address=center_data["address"],
    #                 country=center_data["country"],
    #                 city=center_data["city"],
    #                 phone=center_data["phone"],
    #                 email=center_data["email"]
    #             )
    #             db.session.add(center)
    #         db.session.commit()
    #         print("All test medical centers inserted successfully!")
    #     except Exception as e:
    #         db.session.rollback()
    #         print(f"Error inserting medical centers: {str(e)}")
    #         raise

    @app.cli.command("insert-test-doctors")
    def insert_test_doctors():
        print("Inserting test data for Doctors")
        doctors_data = [
            {
                
                "email": "dr.smith@gmail.com",
                "first_name": "John",
                "last_name": "Smith",
                "phone_number": "5551234567",
                "password": "1234",
                "is_active": True,
                "has_specialties": False
            },
            {
                
                "email": "dr.jones@gmail.com",
                "first_name": "Emily",
                "last_name": "Jones",
                "phone_number": "5559876543",
                "password": "1234",
                "is_active": True,
                "has_specialties": False
            },
            {
                
                "email": "juan@gmail.com",
                "first_name": "Juan",
                "last_name": "Jones",
                "phone_number": "5559876543",
                "password": "1234",
                "is_active": True,
                "has_specialties": False
            },
            {
                
                "email": "dr.brown@gmail.com",
                "first_name": "Michael",
                "last_name": "Brown",
                "phone_number": "5554567890",
                "password": "1234",
                "is_active": True,
                "has_specialties": False
            }
        ]

        try:
            for doctor_data in doctors_data:
                doctor = Doctors(
                    email=doctor_data["email"],
                    first_name=doctor_data["first_name"],
                    last_name=doctor_data["last_name"],
                    phone_number=doctor_data["phone_number"],
                    password=doctor_data["password"],
                    is_active=doctor_data["is_active"],
                    has_specialties=doctor_data["has_specialties"]
                
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
            { "name": "urology"},
            { "name": "cardiology"},
            { "name": "gynecology"}
        ]

        try:
            for specialty_data in specialties_data:
                specialty = Specialties(
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
                
                "id_patient": patients[0].id,  # First patient
                "id_doctor": doctors[0].id,    # First doctor
                "id_center": medical_centers[0].id,  # First medical center
                "date": datetime.strptime("15-09-2025", "%d-%m-%Y").date(),
                "hour": datetime.strptime("13:00", "%H:%M").time(),
                "id_specialty": 1,  # urology
                "confirmation": "confirmed"
            },
            {
                
                "id_patient": patients[1].id,  # Second patient
                "id_doctor": doctors[1].id,    # Second doctor
                "id_center": medical_centers[1].id,  # Second medical center
                "date": datetime.strptime("18-09-2025", "%d-%m-%Y").date(),
                "hour": datetime.strptime("10:00", "%H:%M").time(),
                "id_specialty": 2,  # cardiology
                "confirmation": "confirmed"
            },
            {
                
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

    @app.cli.command("insert-test-reviews")
    def insert_test_reviews():
        print("Inserting test data for Reviews")
        reviews_data = [
            {
            
                "id_doctor": 1,
                "id_patient": 1,
                "date": datetime(2023, 3, 5).date(),
                "id_center": 1,
                "rating": 5,
                "comments": "The doctor was very attentive"
            },
            {
                
                "id_doctor": 2,
                "id_patient": 2,
                "date": datetime(2023, 2, 10).date(),
                "id_center": 2,
                "rating": 2,
                "comments": "The doctor was late for the appointment"
            },
            {
                
                "id_doctor": 3,
                "id_patient": 3,
                "date": datetime(2023, 2, 11).date(),
                "id_center": 3,
                "rating": 5,
                "comments": "I felt very comfortable and well attended to"
            }
        ]

        try:
            for review_data in reviews_data:
                review = Review(
                    
                    id_doctor=review_data["id_doctor"],
                    id_patient=review_data["id_patient"],
                    date=review_data["date"],
                    id_center=review_data["id_center"],
                    rating=review_data["rating"],
                    comments=review_data["comments"]
                )
                db.session.add(review)
            db.session.commit()
            print("All test reviews inserted successfully!")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting reviews: {str(e)}")
            raise