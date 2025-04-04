import React, { useContext ,useEffect, useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Doctors = () => {
    const { store, actions } = useContext(Context);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
    });

    // Cargar la lista de doctores cuando el componente se monta
    useEffect(() => {
        actions.getDoctors();
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
            // Actualizar datos del doctorcito
            await actions.updateDoctor(editId, formData);
            setEditId(null);
          } else {
            // Crear al doctor
            await actions.createDoctor(formData);
          }
          // Limpiar formulario
          setFormData({
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            password: "",
          });
        } catch (error) {
          alert("Error: " + error.message);
        }
      };
    
      // Manejar edición
      const handleEdit = (doctor) => {
        setFormData({
          email: doctor.email,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          phone_number: doctor.phone_number,
          password: "", 
        });
        setEditId(doctor.id);
      };

    // ELIMINAR DOCTOR SEGUN ID
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que se desea eliminar?")) {
            try {
                await actions.deleteDoctor(id);
            } catch (error) {
                alert("Error: revise qué pasó.. " + error.message);
            }
        }
    };

    // CONSOLE LOG PARA VER EN COMPONENTE LISTADO DE DOCTORES
   // console.log("Lista de Doctores en el Store:", store.doctors);

    return (
        <div className="container">

            <h1>{editId ? "Editar Doctor" : "Crear Doctor"}</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Nombre:</label>
                    <input type="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input type="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Telefono:</label>
                    <input type="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <button type="submit">{editId ? "Actualizar" : "Crear"} Doctor</button>
                    {editId && (
                    <button type="button" onClick={() => setEditId(null)}> Cancelar</button> ) }

                </form>

            <h1>Doctores Creados en sistema</h1>
            <ul>
                {store.doctors && store.doctors.length > 0 ? (
                    store.doctors.map((doctor) => (
                        <li key={doctor.id}>
                            {doctor.first_name} {doctor.last_name} ({doctor.email})
                            <button onClick={() => handleDelete(doctor.id)}>Eliminar</button>
                            <button onClick={() => handleEdit(doctor)}>Editar</button>
                        </li>
                    ))
                ) : (
                    <p>No hay doctores registrados.</p>
                )}
            </ul>
        
        <br />
        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>

        </div>
    );
};