import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Doctors = () => {
    const { store, actions } = useContext(Context);
    const [editId, setEditId] = useState(null);
    const [photo, setPhoto] = useState(null);  // Estado para la imagen
    const [removeImage, setRemoveImage] = useState(false);  // Estado para eliminar la imagen

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
    });

    useEffect(() => {
        actions.getDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);  // Guardar el archivo seleccionado
        setRemoveImage(false);  // Si se selecciona una nueva imagen, desmarcar la opción de eliminar
    };

    const handleRemoveImageChange = (e) => {
        setRemoveImage(e.target.checked);  // Actualizar el estado de eliminar imagen
        if (e.target.checked) {
            setPhoto(null);  // Si se marca eliminar, limpiar el archivo seleccionado
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("phone_number", formData.phone_number);
            data.append("password", formData.password);
            if (photo) {
                data.append("photo", photo);  // Añadir la imagen si existe
            }
            if (editId && removeImage) {
                data.append("remove_image", "true");  // Añadir el campo para eliminar la imagen
            }

            if (editId) {
                await actions.updateDoctor(editId, data);
                setEditId(null);
                setRemoveImage(false);  // Limpiar el estado de eliminar imagen
            } else {
                await actions.createDoctor(data);
            }
            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                password: "",
            });
            setPhoto(null);  // Limpiar el campo de la imagen
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const handleEdit = (doctor) => {
        setFormData({
            email: doctor.email,
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            phone_number: doctor.phone_number,
            password: "",
        });
        setEditId(doctor.id);
        setPhoto(null);  // Limpiar el campo de la imagen al editar
        setRemoveImage(false);  // Limpiar el estado de eliminar imagen
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que se desea eliminar?")) {
            try {
                await actions.deleteDoctor(id);
            } catch (error) {
                alert("Error: revise qué pasó.. " + error.message);
            }
        }
    };

    console.log("Lista de Doctores en el Store:", store.doctors);

    return (
        <div className="container">
            <h1>{editId ? "Editar Doctor" : "Crear Doctor"}</h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Nombre:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Foto:</label>
                    <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />
                </div>
                {editId && store.doctors.find(doctor => doctor.id === editId)?.url && (
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={removeImage}
                                onChange={handleRemoveImageChange}
                            />
                            Eliminar imagen actual
                        </label>
                    </div>
                )}

                <button type="submit">{editId ? "Actualizar" : "Crear"} Doctor</button>
                {editId && (
                    <button type="button" onClick={() => setEditId(null)}> Cancelar</button>
                )}
            </form>

            <h1>Doctores Creados en sistema</h1>
            <ul>
                {store.doctors && store.doctors.length > 0 ? (
                    store.doctors.map((doctor) => (
                        <li key={doctor.id}>
                            {doctor.first_name} {doctor.last_name} ({doctor.email})
                            {doctor.url && (
                                <div>
                                    <img
                                        src={doctor.url}
                                        alt={`${doctor.first_name} ${doctor.last_name}`}
                                        style={{ width: "100px", height: "100px" }}
                                    />
                                </div>
                            )}
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

export default Doctors;