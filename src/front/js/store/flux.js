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
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

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

			getPatients: async () => {
				try {
				  const resp = await fetch(process.env.BACKEND_URL + "/api/patients");
				  if (!resp.ok) {
					const errorText = await resp.text();
					throw new Error(`Error fetching patients: ${resp.status} - ${errorText}`);
				  }
				  const data = await resp.json();
				  console.log("Pacientes obtenidos:", data); // Verifica los datos recibidos
				  setStore({ patients: data });
				  return data;
				} catch (error) {
				  console.log("Error fetching patients:", error.message);
				}
			  },

			 // Crear un paciente
			 createPatient: async (patientData) => {
				try {
				  const resp = await fetch(process.env.BACKEND_URL + "/api/patients", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify(patientData),
				  });
				  if (!resp.ok) throw new Error("Error creating patient");
				  const data = await resp.json();
				  getActions().getPatients(); // Refrescar la lista
				  return data;
				} catch (error) {
				  console.log("Error creating patient:", error);
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
