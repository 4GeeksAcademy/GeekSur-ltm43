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

            
        }
    };
};

export default getState;