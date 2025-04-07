import React, { useContext ,useEffect, useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Specialties = () => {
    const { store, actions } = useContext(Context);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
    });

    // Cargar la lista de especialidades cuando el componente se monta

    useEffect(() => {
        actions.getSpecialties();
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
        // Actualizar datos del Especialidades
        await actions.updateSpecialties(editId, formData);
        setEditId(null);
      } else {
        // Crear Specialties
        await actions.createSpecialties(formData);
      }
      // Limpiar formulario
      setFormData({
        name: "",
       });
     } catch (error) {
       alert("Error: " + error.message);
     }
   };
    // Manejar edición
    const handleEdit = (specialties) => {
        setFormData({
        name: specialties.name,
        });
        setEditId(specialties.id);
    };

    // ELIMINAR SPECIALTIES SEGUN ID
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que se desea eliminar?")) {
            try {
                await actions.deleteSpecialties(id);
            } catch (error) {
                alert("Error: revise qué pasó.. " + error.message);
            }
        }
    };
  // CONSOLE LOG PARA VER EN COMPONENTE LISTADO DE ESPECIALIDADES
  console.log("Lista de Especialidades en el Store:", store.specialties);

  return (
      <div className="container">

          <h1>{editId ? "Editar Especialidad" : "Crear Especialidad"}</h1>

          <form onSubmit={handleSubmit}>
              <div>
                  <label>Nombre:</label>
                  <input type="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

               <button type="submit">{editId ? "Actualizar" : "Crear"} Especialidad </button>
                  {editId && (
                  <button type="button" onClick={() => setEditId(null)}> Cancelar</button> ) }

              </form>

          <h1>Especialidades Creados en sistema</h1>
          <ul>
              {store.specialties && store.specialties.length > 0 ? (
                  store.specialties.map((specialties) => (
                      <li key={specialties.id}>
                          {specialties.name} 
                          <button onClick={() => handleDelete(specialties.id)}>Eliminar</button>
                          <button onClick={() => handleEdit(specialties)}>Editar</button>
                      </li>
                  ))
              ) : (
                  <p>No hay especialidades registrados.</p>
              )}
          </ul>
          
          <br />
        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>
      </div>
  );
}