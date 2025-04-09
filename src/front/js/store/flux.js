const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],

            patients: [],
            doctors: [],
            specialties: [],
            specialties_doctor: [],
            medicalCenters: [],
            medicalCenterFormData: {
                name: "",
                address: "",
                country: "",
                city: "",
                phone: "",
                email: "",
                latitude: "",
                longitude: ""
            },
            editingMedicalCenter: null,
            medicalCenterError: null,
            medicalCenterSuccessMessage: null,
            appointments: [],
            appointmentError: null,
            appointmentSuccessMessage: null,
            tokenpatient: null,
            authPatient: false,
            currentPatient: null,
            dashboardPatientData: null,
            loginPatientError: null,
            reviews: [],
            reviewError: null,
            reviewSuccessMessage: null,
            specialtiesOptions: [],
            medicalCoveragesOptions: [],
            locationsOptions: [],
            searchProfessionalsResults: [],
            searchProfessionalsError: null,
            tokendoctor: null,
            currentDoctor: null,
            dashboardDoctorData: null,
            loginDoctorError: null,
            medicalCenterDoctor: [],
            authDoctor: false,
            selectedSpecialties:[],
            addSpecialtyToDoctor: null,
            addSpecialtyToDoctor_1:null,
            getDoctorSpecialties:null,
            doctorPanelData: null,   //oscar
            deleteDoctorSpecialty: null,
            addMedicalCenterDoctor: null,
            doctorSpecialties: [],
            deleteMedicalCenterDoctor: null,
            updateMedicalCenterDoctor: null,
            doctorAppointments: [],
            patientAppointments: [],
            patientAppointmentError: null,
        },
        actions: {
            updatePatientProfile: async (patientData) => {
                try {
                    const store = getStore();
                    const resp = await fetch(process.env.BACKEND_URL + `/api/patients/${store.dashboardPatientData.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${store.tokenpatient}` // Asegúrate de enviar el token
                        },
                        body: JSON.stringify(patientData),
                    });
                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.message || "Error al actualizar el perfil.");
                    }
                    const updatedPatient = await resp.json();
                    setStore({ dashboardPatientData: updatedPatient }); // Actualiza el store
                    return true; // Indica éxito
                } catch (error) {
                    console.error("Error al actualizar perfil:", error);
                    throw error; // Lanza el error para que el componente lo maneje
                }
            },
            getDashboardPatient: async () => {
                try {
                    const store = getStore();
                    const resp = await fetch(process.env.BACKEND_URL + "/api/patients/profile", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${store.tokenpatient}`
                        }
                    });
                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.message || "Error al obtener perfil del paciente.");
                    }
                    const data = await resp.json();
                    setStore({ dashboardPatientData: data });
                    return data;
                } catch (error) {
                    console.error("Error al obtener datos del paciente:", error);
                    throw error;
                }
            },
            logoutPatient: () => {
                setStore({
                    tokenpatient: null,
                    authPatient: false,          // Asegúrate de limpiar authPatient
                    currentPatient: null,
                    dashboardPatientData: null,  // Limpia explícitamente los datos del dashboard
                    loginPatientError: null,
                });
                localStorage.removeItem("tokenpatient");
            },
            ///////////////////START/////////////////////////////////DOCTORS////////////////////////////////////

            // SE CREA ACTION PARA VER LISTA DE DOCTOR EN COMPONENTE DOCTORS
            getDoctors: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/doctors");
                    const data = await response.json();

                    if (response.ok) {
                        setStore({ doctors: data.Doctors });
                    } else {
                        console.error("Error al obtener doctores:", data.msg);
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                }
            },

            // ACTION PARA ELIMINAR DOCTOR
            deleteDoctor: async (id) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/doctors/${id}`, {
                    method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error al tratar de borrar al doctor. revise...");
                    getActions().getDoctors(); // esto para que al borrar actualice lista con los que quedan
                } catch (error) {
                    console.log("Error al borrar al doctor. revisar..:", error);
                    throw error;
                }
            },
           
            // ACTION PARA CREAR DOCTOR
            createDoctor: async (formData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/doctors", {
                        method: "POST",
                        body: formData,
                    });
                    if (!resp.ok) throw new Error("Error creating...");
                    const data = await resp.json();
                    getActions().getDoctors();
                    return data;
                } catch (error) {
                    console.log("Error....:", error);
                    throw error;
                }
            },



            // UPDATE A DOCTOR
            updateDoctor: async (id, formData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/doctors/${id}`, {
                        method: "PUT",
                        body: formData,
                    });
                    if (!resp.ok) throw new Error("Error updating Doctor");
                    const data = await resp.json();
                    getActions().getDoctors();
                    return data;
                } catch (error) {
                    console.log("Error updating doctor:", error);
                    throw error;
                }
            },
            ///////////////////END/////////////////////////////////DOCTORS/////////////////////////////////////

            ///////////////////Beguin Patients/////////////////////////////////Beguin Patients/////////////////////////////////////

            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
                    const data = await resp.json()
                    setStore({ message: data.message })
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error)
                }
            },

            getPatients: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/patients", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error fetching patients: ${resp.status} - ${errorText}`);
                    }
                    const data = await resp.json();
                    console.log("Pacientes obtenidos:", data);
                    setStore({ patients: data });
                    return data;
                } catch (error) {
                    console.log("Error fetching patients:", error.message);
                }
            },

            createPatient: async (patientData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/patients", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(patientData),
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error creating patient: ${resp.status} - ${errorText}`);
                    }
                    const data = await resp.json();
                    getActions().getPatients(); // Refrescar la lista
                    return data;
                } catch (error) {
                    console.log("Error creating patient:", error.message);
                    throw error;
                }
            },
            
            updatePatient: async (id, patientData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/patients/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(patientData),
                    });
                    if (!resp.ok) throw new Error("Error updating patient");
                    const data = await resp.json();
                    getActions().getPatients(); // Refresh the list
                    return data;
                } catch (error) {
                    console.log("Error updating patient:", error);
                    throw error;
                }
            },

            deletePatient: async (id) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/patients/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error deleting patient");
                    getActions().getPatients();
                } catch (error) {
                    console.log("Error deleting patient:", error);
                    throw error;
                }
            },

            validatePatientAuth: () => {
                console.log("validatePatientAuth")
            },
            ///////////////////End Patients/////////////////////////////////End Patients/////////////////////////////////////

            ///////////////////Beguin Patients appointment and review/////////////////////////////////

            getPatientAppointments: async () => {
                try {
                    const token = localStorage.getItem("tokenpatient");
                    if (!token) {
                        setStore({ patientAppointmentError: "No hay token, por favor inicia sesión" });
                        return;
                    }
                    const response = await fetch(`${process.env.BACKEND_URL}/api/patient/appointments`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ patientAppointments: data.appointments, patientAppointmentError: null });
                    } else {
                        setStore({ patientAppointmentError: data.msg || "Error al cargar las citas" });
                    }
                } catch (error) {
                    console.error("Error fetching patient appointments:", error);
                    setStore({ patientAppointmentError: "Error al cargar las citas" });
                }
            },

            // Nueva acción para crear una reseña desde el paciente
            createPatientReview: async (reviewData) => {
                try {
                    const token = localStorage.getItem("tokenpatient");
                    if (!token) {
                        setStore({ reviewError: "No hay token, por favor inicia sesión" });
                        return;
                    }
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/patient/reviews`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(reviewData),
                    });
                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.msg || "Error creando la reseña");
                    }
                    setStore({ reviewSuccessMessage: "Reseña creada exitosamente", reviewError: null });
                    getActions().getReviews(); // Refrescar la lista de reseñas generales
                    return data;
                } catch (error) {
                    console.error("Error creando la reseña:", error);
                    setStore({ reviewError: error.message, reviewSuccessMessage: null });
                    throw error;
                }
            },
            ///////////////////End Patients appointment and review/////////////////////////////////

            ///////////////////START/////////////////////////////////APPOINTMENTS/////////////////////////////////////
            getAppointments: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/appointments");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ appointments: data.Appointments, appointmentError: null });
                    } else {
                        console.error("Error al obtener appointments:", data.msg);
                        setStore({ appointmentError: "Error loading appointments" });
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    setStore({ appointmentError: "Error loading appointments" });
                }
            },

            createAppointment: async (appointmentData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/appointments", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(appointmentData),
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error creating appointment: ${errorText}`);
                    }
                    const data = await resp.json();
                    getActions().getAppointments();
                    setStore({ appointmentSuccessMessage: "Appointment created successfully!", appointmentError: null });
                    return data;
                } catch (error) {
                    console.log("Error creating appointment:", error);
                    setStore({ appointmentError: "Error creating appointment", appointmentSuccessMessage: null });
                    throw error;
                }
            },

            updateAppointment: async (id, appointmentData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/appointments/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(appointmentData),
                    });
                    if (!resp.ok) throw new Error("Error updating appointment");
                    const data = await resp.json();
                    getActions().getAppointments();
                    setStore({ appointmentSuccessMessage: "Appointment updated successfully!", appointmentError: null });
                    return data;
                } catch (error) {
                    console.log("Error updating appointment:", error);
                    setStore({ appointmentError: "Error updating appointment", appointmentSuccessMessage: null });
                    throw error;
                }
            },

            deleteAppointment: async (id) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/appointments/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error deleting appointment");
                    getActions().getAppointments();
                    setStore({ appointmentSuccessMessage: "Appointment deleted successfully!", appointmentError: null });
                } catch (error) {
                    console.log("Error deleting appointment:", error);
                    setStore({ appointmentError: "Error deleting appointment", appointmentSuccessMessage: null });
                    throw error;
                }
            },
            ///////////////////END/////////////////////////////////APPOINTMENTS/////////////////////////////////////

            ///////////////////BEGUIN/////////////////////////////////doctor_appointment/////////////////////////////////////

            getDoctorAppointments: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/doctor/appointments`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("tokendoctor")}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ doctorAppointments: data.appointments });
                    } else {
                        setStore({ doctorAppointments: [], error: data.msg });
                    }
                } catch (error) {
                    console.error("Error fetching doctor appointments:", error);
                    setStore({ doctorAppointments: [], error: "Error fetching appointments" });
                }
            },

            manageDoctorAppointment: async (appointmentId, action) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/doctor/appointments/${appointmentId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("tokendoctor")}`,
                        },
                        body: JSON.stringify({ action }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        getActions().getDoctorAppointments(); // Refrescar la lista
                    } else {
                        console.error("Error managing appointment:", data.msg);
                    }
                } catch (error) {
                    console.error("Error managing appointment:", error);
                }
            },

            ///////////////////END/////////////////////////////////doctor_appointment/////////////////////////////////////

            ///////////// BEGIN MEDICAL CENTER /////////////
            getMedicalCenters: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/medical_centers", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error fetching medical centers: ${resp.status} - ${errorText}`);
                    }
                    const data = await resp.json();
                    console.log("Medical centers obtained:", data);
                    setStore({ medicalCenters: data, medicalCenterError: null });
                    return data;
                } catch (error) {
                    console.log("Error fetching medical centers:", error.message);
                    setStore({ medicalCenterError: "Error loading medical centers: " + error.message });
                }
            },

            setMedicalCenterFormData: (data) => {
                setStore({ medicalCenterFormData: { ...getStore().medicalCenterFormData, ...data } });
            },

            setEditingMedicalCenter: (center) => {
                setStore({
                    editingMedicalCenter: center, medicalCenterFormData: center || {
                        name: "", address: "", country: "", city: "", phone: "", email: ""
                    }
                });
            },

            clearMedicalCenterFormData: () => {
                setStore({
                    medicalCenterFormData: {
                        name: "", address: "", country: "", city: "", phone: "", email: ""
                    },
                    editingMedicalCenter: null,
                    medicalCenterSuccessMessage: null,
                    medicalCenterError: null,
                });
            },

            addMedicalCenter: async () => {
                const store = getStore();
                const formData = store.medicalCenterFormData;
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/medical_centers", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error adding medical center: ${resp.status} - ${errorText}`);
                    }
                    const data = await resp.json();
                    getActions().getMedicalCenters();
                    setStore({ medicalCenterSuccessMessage: "Medical center added successfully!", medicalCenterError: null });
                    getActions().clearMedicalCenterFormData();
                    return data;
                } catch (error) {
                    console.log("Error adding medical center:", error.message);
                    setStore({ medicalCenterError: "Error adding medical center.", medicalCenterSuccessMessage: null });
                    throw error;
                }
            },

            updateMedicalCenter: async () => {
                const store = getStore();
                const formData = store.medicalCenterFormData;
                const editingCenter = store.editingMedicalCenter;
                if (!editingCenter) return;
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/medical_centers/${editingCenter.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!resp.ok) throw new Error("Error updating medical center");
                    const data = await resp.json();
                    getActions().getMedicalCenters();
                    setStore({ medicalCenterSuccessMessage: "Medical center updated successfully!", medicalCenterError: null });
                    getActions().clearMedicalCenterFormData();
                    return data;
                } catch (error) {
                    console.log("Error updating medical center:", error);
                    setStore({ medicalCenterError: "Error updating medical center.", medicalCenterSuccessMessage: null });
                    throw error;
                }
            },

            deleteMedicalCenter: async (id) => {
                if (!window.confirm("Are you sure you want to delete this medical center?")) {
                    return;
                }
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/medical_centers/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error deleting medical center");
                    getActions().getMedicalCenters();
                    setStore({ medicalCenterSuccessMessage: "Medical center deleted successfully!", medicalCenterError: null });
                } catch (error) {
                    console.log("Error deleting medical center:", error);
                    setStore({ medicalCenterError: "Error deleting medical center.", medicalCenterSuccessMessage: null });
                    throw error;
                }
            },
            ///////////// END MEDICAL CENTER /////////////

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            ///////////////////START/////////////////////////////////SPECIALTIES///////////////////////////

            // SE CREA ACTION PARA VER LISTA DE ESPECIALIDADES 
            getSpecialties: async () => {

                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/specialties");
                    const data = await response.json();


                    if (response.ok) {
                        setStore({ specialties: data.Specialties });
                    } else {
                        console.error("Error al obtener Espacialidades:", data.msg);
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                }
            },

            // ACTION PARA CREAR ESPECIALIDAD
            createSpecialties: async (specialtyData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/specialties", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specialtyData),
                    });
                    if (!resp.ok) throw new Error("Error creating...");
                    const data = await resp.json();
                    getActions().getSpecialties();
                    return data;
                } catch (error) {
                    console.log("Error....:", error);
                    throw error;
                }
            },

            // ACTION PARA ELIMINAR Especialidad
            deleteSpecialties: async (id) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/specialties/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error al tratar de borrar la especialidad. revise...");
                    getActions().getSpecialties(); // esto para que al borrar actualice lista con los que quedan
                } catch (error) {
                    console.log("Error al tratar de borrar la especialidad. revise", error);
                    throw error;
                }
            },

            // UPDATE ESPECIALIDAD
            updateSpecialties: async (id, specialtyData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/specialties/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specialtyData),
                    });
                    if (!resp.ok) throw new Error("Error updating Especialidad");
                    const data = await resp.json();
                    getActions().getSpecialties();
                    return data;
                } catch (error) {
                    console.log("Error updating especialidad:", error);
                    throw error;
                }
            },
            ///////////////////END/////////////////////////////////SPECIALTIES///////////////////////////

            ///////////////////START/////////////////////////////////SPECIALTIES_DOCTOR///////////////////////////

            // SE CREA ACTION PARA VER LISTA DE ESPECIALIDADES_DOCTOR 
            getSpecialties_doctor: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/specialties_doctor");
                    const data = await response.json();

                    if (response.ok) {
                        setStore({ specialties_doctor: data.Specialties_doctor });
                    } else {
                        console.error("Error al obtener Especialidades_doctor:", data.msg);
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                }
            },

            // ACTION PARA CREAR ESPECIALIDAD_DOCTOR
            createSpecialties_doctor: async (specialtyData) => {
                try {
                    console.log("Datos a enviar:", specialtyData);
                    const resp = await fetch(process.env.BACKEND_URL + "/api/specialties_doctor", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specialtyData),
                    });
                    if (!resp.ok) throw new Error("Error creating...");
                    const data = await resp.json();
                    getActions().getSpecialties_doctor();
                    return data;
                } catch (error) {
                    console.log("Error....:", error);
                    throw error;
                }
            },

            // ACTION PARA ELIMINAR Especialidad_doctor
            deleteSpecialties_doctor: async (id) => {
                const store = getStore();
                const token = store.tokendoctor || localStorage.getItem("tokendoctor");
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/specialties_doctor/${id}`, {
                        method: "DELETE",
                        "Authorization": `Bearer ${token}`,
                    });
                    if (!resp.ok) throw new Error("Error al tratar de borrar la especialidad_doctor. revise...");
                    getActions().getSpecialties_doctor(); // esto para que al borrar actualice lista con los que quedan
                } catch (error) {
                    console.log("Error al tratar de borrar la especialidad_doctor. revise", error);
                    throw error;
                }
            },

            // UPDATE ESPECIALIDAD_DOCTOR
            updateSpecialties_doctor: async (id, specialtyData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/specialties_doctor/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specialtyData),
                    });
                    if (!resp.ok) throw new Error("Error updating Especialidad_doctor");
                    const data = await resp.json();
                    getActions().getSpecialties_doctor();
                    return data;
                } catch (error) {
                    console.log("Error updating especialidad_doctor:", error);
                    throw error;
                }
            },
            ///////////////////END/////////////////////////////////SPECIALTIES_DOCTOR///////////////////////////

            ///////////////////// BEGIN REVIEWS //////////////////////////

            getReviews: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/reviews");
                    const data = await response.json();
                    if (response.ok) {
                        setStore({ reviews: data.Reviews, reviewError: null });
                    } else {
                        console.error("Error al obtener las reseñas:", data.msg);
                        setStore({ reviewError: "Error loading reviews" });
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                    setStore({ reviewError: "Error loading reviews" });
                }
            },

            createReview: async (reviewData) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/reviews", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(reviewData),
                    });
                    if (!resp.ok) {
                        const errorText = await resp.text();
                        throw new Error(`Error creating review: ${errorText}`);
                    }
                    const data = await resp.json();
                    getActions().getReviews();
                    setStore({ reviewSuccessMessage: "Review created successfully!", reviewError: null });
                    return data;
                } catch (error) {
                    console.log("Error creating review:", error);
                    setStore({ reviewError: "Error creating review", reviewSuccessMessage: null });
                    throw error;
                }
            },

            updateReview: async (id, reviewData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/reviews/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(reviewData),
                    });
                    if (!resp.ok) throw new Error("Error updating review");
                    const data = await resp.json();
                    getActions().getReviews();
                    setStore({ reviewSuccessMessage: "Review updated successfully!", reviewError: null });
                    return data;
                } catch (error) {
                    console.log("Error updating review:", error);
                    setStore({ reviewError: "Error updating review", reviewSuccessMessage: null });
                    throw error;
                }
            },

            deleteReview: async (id) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/reviews/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error deleting review");
                    getActions().getReviews();
                    setStore({ reviewSuccessMessage: "Review deleted successfully!", reviewError: null });
                } catch (error) {
                    console.log("Error deleting review:", error);
                    setStore({ reviewError: "Error deleting review", reviewSuccessMessage: null });
                    throw error;
                }
            },

            ////////////////////////// END REVIEW  /////////////////////////////////

            ////////////////////////// BEGIN SEARCH PROFESSIONALS  /////////////////////////////////
            getLocations: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/locations`);
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || 'Error al obtener ubicaciones');
                    }
                    const data = await response.json();
                    setStore({ locationsOptions: data.locations || [] });
                } catch (error) {
                    console.error("Error al obtener las ubicaciones:", error);

                }
            },

            searchProfessionals: async (searchCriteria) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/professionals/search`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(searchCriteria),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg || 'Error al buscar profesionales');
                    }

                    const data = await response.json();
                    setStore({ searchProfessionalsResults: data.professionals || [], searchProfessionalsError: null });
                    return data.professionals || [];
                } catch (error) {
                    console.error("Error al buscar profesionales:", error);
                    setStore({ searchProfessionalsResults: [], searchProfessionalsError: error.message });
                    return null;
                }
            },
            ////////////////////////// END SEARCH PROFESSIONALS  /////////////////////////////////


            // Acción para login de pacientes
            loginPatient: async (email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/loginpatient", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await resp.json();

                    
                    if (!resp.ok) throw new Error(data.msg || "Error en el login");

                    setStore({
                        tokenpatient: data.tokenpatient,
                        authPatient: true,
                        currentPatient: data.patient,
                        loginPatientError: null,
                    });
                    localStorage.setItem("tokenpatient", data.tokenpatient);
                    return data;
                } catch (error) {
                    console.log("Error en el login:", error.message);
                    setStore({ loginPatientError: error.message });
                    throw error;
                }
            },

            getDashboardPatient: async () => {
                const store = getStore();
                const token = store.tokenpatient || localStorage.getItem("tokenpatient");
                if (!token) {
                    setStore({ loginPatientError: "No hay token, por favor inicia sesión" });
                    return;
                }

                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/dashboardpatient", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.msg || "Error al cargar el dashboard");

                    setStore({ dashboardPatientData: data.patient });
                    return data;
                } catch (error) {
                    console.log("Error al cargar el dashboard:", error.message);
                    setStore({ loginPatientError: error.message });
                    throw error;
                }
            },

            // Acción para logout
            logoutPatient: () => {
                setStore({
                    authPatient: false,
                    currentPatient: null,
                    dashboardPatientData: null,
                    loginPatientError: null,
                });
                localStorage.removeItem("tokenpatient");
            },


            loadTokenPatient: () => {
                const token = localStorage.getItem("tokenpatient");
                if (token) {
                    setStore({ tokenpatient: token });
                    getActions().getDashboardPatient();
                }
            },
            // Acción para cargar el token desde localStorage al iniciar la app
            validateAuthPatient: async () => {
                const token = localStorage.getItem("tokenpatient");
                if (token) {
                    setStore({ tokenpatient: token, authPatient: true });
                    try {
                        await getActions().getDashboardPatient(); // Verifica el token y carga datos
                        console.log("Paciente autenticado correctamente");
                    } catch (error) {
                        console.error("Token inválido, cerrando sesión:", error);
                        getActions().logoutPatient(); // Si el token no es válido, cerrar sesión
                    }
                }
            },

            ////////////////////////////////////////////////////////// START///// LOGIN DOCTOR  /////////////////////////////////

            loginDoctor: async (email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/logindoctor", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.msg || "Revise el error en el login...");

                    // Guardar el tokendoctor y sus datos en el store y localStorage

                    setStore({

                        tokendoctor: data.tokendoctor,
                        authDoctor: true,
                        currentDoctor: data.doctor,
                        loginDoctorError: null,
                    });
                    localStorage.setItem("tokendoctor", data.tokendoctor);
                    return data;
                } catch (error) {
                    console.log("Error en el login:", error.message);
                    setStore({ loginDoctorError: error.message });
                    throw error;
                }
            },

            // ACTION: Upload the Dashboard 
            getDashboardDoctor: async () => { 
                const store = getStore();
                const token = store.tokendoctor || localStorage.getItem("tokendoctor");
                
                if (!token) {
                    setStore({ loginDoctorError: "No hay token, por favor inicia sesión" });
                    return;
                }
            
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/dashboarddoctor", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });
            
                    const data = await resp.json();
                    console.log("🚀 Datos recibidos de la API:", data); 
            
                    if (!resp.ok) throw new Error(data.error || "Error al cargar el dashboard");
            
                    setStore({
                        dashboardDoctorData: data
                    });
            
                    return data;
                } catch (error) {
                    console.log("Error al cargar el Panel:", error.message);
                    setStore({ loginDoctorError: error.message });
                    throw error;
                }
            },
            
            // Acción para logout

            logoutDoctor: () => {
                setStore({
                    tokendoctor: null,
                    authDoctor: false,
                    currentDoctor: null,
                    dashboardDoctorData: null,
                    loginDoctorError: null,
                    paneldoctor:null
                });
                localStorage.removeItem("tokendoctor");
            },

            // Acción para cargar el token desde localStorage al iniciar la app
            validateAuthDoctor: async () => {
                const token = localStorage.getItem("tokendoctor");
                if (token) {
                    setStore({ tokendoctor: token, authDoctor: true });
                    try {
                        await getActions().getDashboardDoctor(); // Verifica el token y carga datos
                        console.log("Doctor autenticado correctamente");
                    } catch (error) {
                        console.error("Token inválido, cerrando sesión:", error);
                        getActions().logoutDoctor(); // Si el token no es válido, cerrar sesión
                    }
                }
            },

            ////////////////////////////////////////////////////////// END///// LOGIN DOCTOR  /////////////////////////////////

            ///////////////////START/////////////////////////////////MedicalCenterDoctor///////////////////////////

///////////// SE CREA ACTION PARA VER LISTA DE ESPECIALIDADES_DOCTOR 

            getMedicalCenterDoctor: async () => {
                const token = localStorage.getItem("tokendoctor");  // Obtener el token JWT del almacenamiento local
            
                if (!token) {
                    console.error("No se encontró el token JWT.");
                    return;
                }
            
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/medicalcenterdoctor", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,  // Enviar el token en el encabezado
                            "Content-Type": "application/json",
                        },
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        setStore({ medical_center_doctor: data.data });  // Aquí asignas los datos a tu store
         
                    } else {
                        console.error("Error al obtener medical_center_doctor:", data.msg);
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error);
                }
            },



            // ACTION PARA CREAR medical_center_doctor
            createMedicalCenterDoctor: async (mcd_Data) => {
                try {
                    console.log("Datos a enviar:", mcd_Data);
                    const resp = await fetch(process.env.BACKEND_URL + "/api/medicalcenterdoctor", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(mcd_Data),
                    });
                    if (!resp.ok) throw new Error("Error creating...");
                    const data = await resp.json();
                    getActions().getMedicalCenterDoctor();
                    return data;
                } catch (error) {
                    console.log("Error....:", error);
                    throw error;
                }
            },

            // ACTION PARA ELIMINAR 
            deleteMedicalCenterDoctor: async (id) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + `/api/medicalcenterdoctor/${id}`, {
                        method: "DELETE",
                    });
                    if (!resp.ok) throw new Error("Error al tratar de borrar la MedicalCenterDoctor. revise...");
                    getActions().getMedicalCenterDoctor(); // esto para que al borrar actualice lista con los que quedan
                } catch (error) {
                    console.log("Error al tratar de borrar la MedicalCenterDoctor. revise", error);
                    throw error;
                }
            },

            // UPDATE MedicalCenterDoctor
            updateMedicalCenterDoctor: async (id, specialtyData) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/medicalcenterdoctor/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(specialtyData),
                    });
                    if (!resp.ok) throw new Error("Error updating MedicalCenterDoctor");
                    const data = await resp.json();
                    getActions().getMedicalCenterDoctor();
                    return data;
                } catch (error) {
                    console.log("Error updating MedicalCenterDoctor:", error);
                    throw error;
                }
            },
///////////////////END/////////////////////////////////MedicalCenterDoctor///////////////////////////

///////////////////START/////////////////////////////////Tener las especialidades escogidas.///////////////////////////

                setSelectedSpecialties: (specialties) => {
                    setStore({ selectedSpecialties: specialties });
                },
///////////////////END/////////////////////////////////Tener las especialidades escogidas.///////////////////////////

// Obtener especialidades del doctor
getDoctorSpecialties: async () => {
    try {
      const token = localStorage.getItem("tokendoctor");
      console.log("Token enviado:", token); // Verifica que el token existe
      if (!token) throw new Error("No hay token disponible");
      const response = await fetch(process.env.BACKEND_URL + "/api/specialties_doctor", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Respuesta del backend:", response.status); // Verifica el código de estado
      if (!response.ok) {
        const data = await response.json();
        console.log("Datos del error:", data); // Muestra el mensaje del backend
        if (response.status === 404) {
            setStore({ doctorSpecialties: [] }); // Doctor sin especialidades
            return;
        }
            throw new Error("Error al obtener las especialidades");
      }
      const data = await response.json();
    setStore({ doctorSpecialties: data.specialties || [] });
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
  }
},
  
  // Agregar especialidad al doctor
  addSpecialtyToDoctor: async (specialtyId) => {
    const store = getStore()
    try {
      const token = localStorage.getItem("tokendoctor");
      if (!token) throw new Error("No hay token disponible");
  
      // Obtener el ID del doctor desde el store (ajusta según tu estructura)
      const doctorId = store.dashboardDoctorData?.id || store.doctorPanelData?.doctor?.id;
      if (!doctorId) throw new Error("No se encontró el ID del doctor");
  
      const response = await fetch(process.env.BACKEND_URL + "/api/specialties_doctor", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_specialty: specialtyId,
          id_doctor: doctorId,
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        console.log("Error del backend:", data); // Depura el mensaje exacto
        throw new Error(data.msg || "Error al agregar especialidad");
      }
  
      return true;
    } catch (error) {
      console.error("Error al agregar especialidad:", error);
      throw error;
    }
  },
  
  // Eliminar especialidad del doctor
  deleteDoctorSpecialty: async (specialtyId) => {
    try {
      const token = localStorage.getItem("tokendoctor");
      if (!token) throw new Error("No hay token disponible");
  
      const response = await fetch(`${process.env.BACKEND_URL}/api/specialties_doctor/${specialtyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || "Error al eliminar especialidad");
      }
  
      return true; // Indicar éxito
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      throw error;
    }
  },

//----------------------oscar


getDoctorPanel: async () => {
    const store = getStore();
    const token = store.tokendoctor || localStorage.getItem("tokendoctor");

    if (!token) {
        setStore({ loginDoctorError: "No hay token, por favor inicia sesión" });
        return;
    }

    try {
        const resp = await fetch(process.env.BACKEND_URL + "/api/paneldoctor", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await resp.json();
        console.log("🚀 Datos recibidos del Panel del Doctor:", data);

        if (!resp.ok) throw new Error(data.error || "Error al cargar los datos del panel del doctor");

        // Actualizamos el estado con los datos recibidos
        setStore({
            doctorPanelData: data, // Aquí almacenamos los datos recibidos en doctorPanelData
        });

        return data;
    } catch (error) {
        console.log("Error al cargar el Panel del Doctor:", error.message);
        setStore({ loginDoctorError: error.message });
        throw error;
    }
},
////////////////////////////////////////////////////////////////////////////

deleteDoctorSpecialty: async (specialtyId) => {
    const token = localStorage.getItem("tokendoctor");
    console.log("Token JWT:", token);  // Verifica que el token esté correcto
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        console.log("Enviando solicitud DELETE para especialidad ID:", specialtyId);  // Verifica si la solicitud se está enviando
        const response = await fetch(process.env.BACKEND_URL + `/api/specialties_doctor/${specialtyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al eliminar la especialidad");
        }

        // Actualizar la lista de especialidades después de eliminar
        getActions().getDoctorPanel();

        console.log("Especialidad eliminada correctamente");
    } catch (error) {
        console.error("Error eliminando la especialidad:", error.message);
    }
},

///////////////////////////////////////////////////////////////////////////////////////

getDoctorOffices: async () => {
    const token = localStorage.getItem("tokendoctor");
    if (!token) {
        console.error("No hay token disponible");
        return;
    }

    try {
        const response = await fetch(process.env.BACKEND_URL + '/api/medicalcenterdoctor', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al obtener las oficinas del doctor");
        }

        // Guardar las oficinas del doctor en el store
        setStore({ doctorOffices: data });
    } catch (error) {
        console.error("Error obteniendo las oficinas:", error.message);
    }
},

//////////////////////////////////////////////////////////////////////////
addMedicalCenterDoctor: async (medicalCenterId, office, specialtyId) => {
    const store = getStore();            
    const token = store.tokendoctor || localStorage.getItem("tokendoctor");

    if (!token) {
        setStore({ loginDoctorError: "No hay token, por favor inicia sesión" });
        return { success: false, msg: "No hay token, por favor inicia sesión" };
    }

    const doctorId = store.doctorPanelData?.doctor.id;

    if (!doctorId) {
        return { success: false, msg: "No se encontró el ID del doctor" };
    }

    try {
        const response = await fetch(process.env.BACKEND_URL + "/api/medicalcenterdoctor", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_doctor: doctorId,
                id_medical_center: medicalCenterId,
                office: office,
                id_specialty: specialtyId
            }),
        });

        const data = await response.json();
        console.log("Respuesta del backend:", data);
        if (!response.ok) {
            return { success: false, msg: data.msg || "Error, Valide Informacion centro médico con esa oficina." };
        }

        const updatedList = Array.isArray(store.medical_center_doctor)
            ? [...store.medical_center_doctor, data.new_medical_center_doctor]
            : [data.new_medical_center_doctor];

        setStore({ medical_center_doctor: updatedList });

        return { success: true };
    } catch (error) {
        console.error("Error, Valide Informacion centro médico con esa oficina:", error.message);
        return { success: false, msg: "Error al conectar con el servidor" };
    }
},

deleteMedicalCenterDoctor: async (centerId) => {
    try {
        const token = localStorage.getItem("tokendoctor");
        if (!token) return false;

        const response = await fetch(process.env.BACKEND_URL + `/api/medicalcenterdoctor/${centerId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Error al eliminar centro médico");
        return true;
    } catch (error) {
        console.error("Error eliminando centro médico:", error);
        return false;
    }
},

updateMedicalCenterDoctor: async (centerId, newOffice) => {
    try {
        const token = localStorage.getItem("tokendoctor");
        if (!token) return false;

        const response = await fetch(process.env.BACKEND_URL + `/api/medicalcenterdoctor/${centerId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ office: newOffice })  // Enviamos el número de oficina en el cuerpo de la solicitud
        });

        if (!response.ok) throw new Error("Error al actualizar el centro médico");

        const data = await response.json();
        if (data.msg === "Número de oficina actualizado correctamente") {
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error actualizando centro médico:", error);
        return false;
    }
}






            ///////////////////END/////////////////////////////////MedicalCenterDoctor///////////////////////////
            
        }
    };
};

export default getState;