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
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
///////////////////START/////////////////////////////////PATIENTS/////////////////////////////////////			
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

			  // Actualizar un paciente
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
				  getActions().getPatients(); // Refrescar la lista
				  return data;
				} catch (error) {
				  console.log("Error updating patient:", error);
				  throw error;
				}
			  },

			  // Eliminar un paciente
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

///////////////////END/////////////////////////////////PATIENTS/////////////////////////////////////	

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
