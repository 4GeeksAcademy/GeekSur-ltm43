import React, { useContext ,useEffect, useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Specialties_doctor = () => {
    const { store, actions } = useContext(Context);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        id_specialty: "",
        id_doctor: "",
    });

    // Cargar la lista de especialidades cuando el componente se monta

    useEffect(() => {
        actions.getSpecialties_doctor();
    }, []);

  // Manejar cambios en el formulario
     const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Actualizar datos del Especialidades_doctor
        await actions.updateSpecialties_doctor(editId, formData);
        setEditId(null);
      } else {
        // Crear Specialties_doctor
        await actions.createSpecialties_doctor(formData);
      }
      // Limpiar formulario
      setFormData({
        id_specialty: "",
        id_doctor: "",
       });
     } catch (error) {
       alert("Error: " + error.message);
     }
   };
    // Manejar edición
    const handleEdit = (specialties_doctor) => {
        setFormData({
            id_specialty: specialties_doctor.id_specialty,  // Asegúrate de asignar todos los campos necesarios
            id_doctor: specialties_doctor.id_doctor,
        });
        setEditId(specialties_doctor.id);
    };

    // ELIMINAR SPECIALTIES_DOCTOR SEGUN ID
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que se desea eliminar?")) {
            try {
                await actions.deleteSpecialties_doctor(id);
            } catch (error) {
                alert("Error: revise qué pasó.. " + error.message);
            }
        }
    };
  // CONSOLE LOG PARA VER EN COMPONENTE LISTADO DE ESPECIALIDADES
  console.log("Lista de Especialidades_doctor en el Store:", store.specialties_doctor);

  return (
      <div className="container">

          <h1>{editId ? "Editar Especialidad" : "Crear Especialidad"}</h1>

          <form onSubmit={handleSubmit}>
              <div>
                  <label>id_specialty:</label>
                  <input type="id_specialty" name="id_specialty" value={formData.id_specialty} onChange={handleChange} required />
              </div>
              <div>
                  <label>id_doctor:</label>
                  <input type="id_doctor" name="id_doctor" value={formData.id_doctor} onChange={handleChange} required />
              </div>

               <button type="submit">{editId ? "Actualizar" : "Crear"} Especialidad </button>
                  {editId && (
                  <button type="button" onClick={() => setEditId(null)}> Cancelar</button> ) }

              </form>

          <h1>Especialidades_doctor Creados en sistema</h1>
          <ul>
                {store.specialties_doctor && store.specialties_doctor.length > 0 ? (
                    store.specialties_doctor.map((specialties_doctor) => (
                        <li key={specialties_doctor.id}>
                            {`Especialidad ID: ${specialties_doctor.id_specialty}, Doctor ID: ${specialties_doctor.id_doctor}`}
                            <button onClick={() => handleDelete(specialties_doctor.id)}>Eliminar</button>
                            <button onClick={() => handleEdit(specialties_doctor)}>Editar</button>
                        </li>
                    ))
                ) : (
                    <p>No hay especialidades registradas.</p>
                )}
            </ul>
      </div>
  );
}
