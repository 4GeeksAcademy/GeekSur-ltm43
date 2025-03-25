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
			doctors: [] ,
            specialties:[],
            specialties_doctor:[],
            medicalCenters: [],
            medicalCenterFormData: {
                name: "",
                address: "",
                country: "",
                city: "",
                phone: "",
                email: "",
            },
            editingMedicalCenter: null,
            medicalCenterError: null,
            medicalCenterSuccessMessage: null,
            appointments: [],
            appointmentError: null,
            appointmentSuccessMessage: null,
            reviews: [],
            reviewError: null,
            reviewSuccessMessage: null,
		},
		
		actions: {

///////////////////START/////////////////////////////////DOCTORS/////////////////////////////////////
				
			// SE CREA ACTION PARA VER LISTA DE DOCTOR EN COMPONENTE DOCTORS
			getDoctors: async () => {
				try {
					
					const response = await fetch(process.env.BACKEND_URL+"/api/doctors");
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
				  	const resp = await fetch(`${process.env.BACKEND_URL}/api/doctors/${id}`, {
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
			 createDoctor: async (doctorData) => {
				try {
				  const resp = await fetch(process.env.BACKEND_URL+"/api/doctors", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify(doctorData),
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
			 updateDoctor: async (id, doctorData) => {
				try {
				  const resp = await fetch(`${process.env.BACKEND_URL}/api/doctors/${id}`, {
					method: "PUT",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify(doctorData),
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
        ///////////////////End Patients/////////////////////////////////End Patients/////////////////////////////////////

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

            ///////////// BEGIN MEDICAL CENTER /////////////
            getMedicalCenters: async () => {
                try {
                    const resp1 = await fetch(process.env.BACKEND_URL + "/api/hello")
                    
                    const data1 = await resp1.json()
                
                    console.log(data1)
                    const resp = await fetch(process.env.BACKEND_URL + "/api/medical_centers", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    console.log(resp)
                    // if (!resp.ok) {
                    //     const errorText = await resp.text();
                    //     // throw new Error(`Error fetching medical centers: ${resp.status} - ${errorText}`);
                    // }
                    const data = await resp.json();
                    console.log(data)
                    console.log("Medical centers obtained:", data);
                    setStore({ medicalCenters: data, medicalCenterError: null });
                    return data;
                } catch (error) {
                    console.log("Error fetching medical centers:", error.message);
                    setStore({ medicalCenterError: "Error loading medical centers." });
                }
            },

            setMedicalCenterFormData: (data) => {
                setStore({ medicalCenterFormData: { ...getStore().medicalCenterFormData, ...data } });
            },

            setEditingMedicalCenter: (center) => {
                setStore({ editingMedicalCenter: center, medicalCenterFormData: center || {
                    name: "", address: "", country: "", city: "", phone: "", email: ""
                } });
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

            

///////////////////END/////////////////////////////////PATIENTS/////////////////////////////////////	

///////////////////START/////////////////////////////////SPECIALTIES///////////////////////////
				
			// SE CREA ACTION PARA VER LISTA DE ESPECIALIDADES 
            getSpecialties: async () => {
				try {
					
					const response = await fetch(process.env.BACKEND_URL+"/api/specialties");
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
				  const resp = await fetch(process.env.BACKEND_URL+"/api/specialties", {
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
				  	const resp = await fetch(process.env.BACKEND_URL+`/api/specialties/${id}`, {
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
                const response = await fetch(process.env.BACKEND_URL+"/api/specialties_doctor");
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
                const resp = await fetch(process.env.BACKEND_URL+"/api/specialties_doctor", {
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
            try {
                const resp = await fetch(process.env.BACKEND_URL+`/api/specialties_doctor/${id}`, {
                    method: "DELETE",
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

////////////////////// BEGIN REVIEWS //////////////////////////

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

// ... dentro de tu bloque actions ...

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






            
        }
    };
};

export default getState;