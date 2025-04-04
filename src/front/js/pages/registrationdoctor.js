import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const RegistrationDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDoctor = await actions.createDoctor(formData);
            console.log("Doctor creado:", newDoctor);

            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                password: "",
            });

            navigate("/logindoctor"); // si todo sale bien se envia al componente de logindoctor
        } catch (error) {
            console.error("Error al registrar doctor:", error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Nombre" required />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Apellido" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Telefono" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" required />
                <button type="submit">Registrar Doctor</button>
            </form>

            <br />
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>

            <Link to="/logindoctor">
                <button className="btn btn-success">Login</button>
            </Link>
        </div>
    );
};
