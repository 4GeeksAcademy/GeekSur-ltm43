import React, { useContext ,useEffect, useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const MedicalCenterDoctor = () => {
    const { store, actions } = useContext(Context);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
       
       id_medical_center : "",
       id_doctor: "",
       office: "",
     
    });

    // Cargar la lista de especialidades cuando el componente se monta

    useEffect(() => {
        actions.getMedicalCenterDoctor();
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
        // Actualizar datos del MedicalCenterDoctor
        await actions.updateMedicalCenterDoctor(editId, formData);
        setEditId(null);
      } else {
        // Crear MedicalCenterDoctor
        await actions.createMedicalCenterDoctor(formData);
      }
      // Limpiar formulario
      setFormData({
        id_medical_center : "",
        id_doctor: "",
        office: "",
       });
     } catch (error) {
       alert("Error: " + error.message);
     }
   };
    // Manejar edición
    const handleEdit = (medical_center_doctor) => {
        setFormData({

            id_medical_center : medical_center_doctor.id_medical_center,
            id_doctor:medical_center_doctor.id_doctor,
            office: medical_center_doctor.office,

        });
        setEditId(medical_center_doctor.id);
    };

    // ELIMINAR medical_center_doctor SEGUN ID
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que se desea eliminar?")) {
            try {
                await actions.deleteMedicalCenterDoctor(id);
            } catch (error) {
                alert("Error: revise qué pasó.. " + error.message);
            }
        }
    };
  // CONSOLE LOG PARA VER EN COMPONENTE LISTADO DE medical_center_doctor
  console.log("Lista de medical_center_doctor en el Store:", store.medical_center_doctor);

  return (
      <div className="container">

          <h1>{editId ? "Editar" : "Crear"}</h1>

          <form onSubmit={handleSubmit}>
              <div>
                  <label>id_medical_center :</label>
                  <input type="id_medical_center" name="id_medical_center" value={formData.id_medical_center} onChange={handleChange} required />
              </div>
              <div>
                  <label>id_doctor:</label>
                  <input type="id_doctor" name="id_doctor" value={formData.id_doctor} onChange={handleChange} required />
              </div>

              <div>
                  <label>office:</label>
                  <input type="office" name="office" value={formData.office} onChange={handleChange} required />
              </div>

               <button type="submit">{editId ? "Actualizar" : "Crear"} Doctor en CM </button>
                  {editId && (
                  <button type="button" onClick={() => setEditId(null)}> Cancelar</button> ) }

              </form>

          <h1>medical_center_doctor Creados en sistema</h1>
          <ul>
                {store.medical_center_doctor && store.medical_center_doctor.length > 0 ? (
                    store.medical_center_doctor.map((medical_center_doctor) => (
                        <li key={medical_center_doctor.id}>
                            {`Especialidad ID: ${medical_center_doctor.id_medical_center}, Doctor ID: ${medical_center_doctor.id_doctor}, Office: ${medical_center_doctor.office}`}
                            <button onClick={() => handleDelete(medical_center_doctor.id)}>Eliminar</button>
                            <button onClick={() => handleEdit(medical_center_doctor)}>Editar</button>
                        </li>
                    ))
                ) : (
                    <p>No hay medical_center_doctor registradas.</p>
                )}
            </ul>
        
        <br />
        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>


      </div>
  );
}
