import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/meedgeeknegro.png";
import login_patient from "../../img/Login_Patient.jpg";
import "../../styles/signup.css";

export const SignupPatient = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        password: "",
        historial_clinico: "",
    });
    const [photo, setPhoto] = useState(null); // Estado para la imagen
    const [error, setError] = useState(""); // Estado para manejar errores

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]); // Guardar el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("gender", formData.gender);
            data.append("birth_date", formData.birth_date);
            data.append("phone_number", formData.phone_number);
            data.append("password", formData.password);
            data.append("historial_clinico", formData.historial_clinico);
            if (photo) {
                data.append("photo", photo); // Agregar la imagen si existe
            }

            await actions.createPatient(data);
            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                gender: "",
                birth_date: "",
                phone_number: "",
                password: "",
                historial_clinico: "",
            });
            setPhoto(null); // Limpiar el campo de la imagen
            alert("Paciente registrado exitosamente");
            navigate("/loginpatient");
        } catch (error) {
            setError(error.message || "Error al registrar paciente");
            console.error("Error al registrar paciente:", error.message);
        }
    };

    return (
        <div className="container_register">
            {/* Columna 1 vacía */}
            <div className="col empty-col"></div>

            <div className="left">
                <div className="signup-info">
                    <div className="logo-container">
                        <img src={login_patient} alt="MedGeek Login" className="login-image" />
                    </div>
                </div>
            </div>

            <div className="right">
                <h3>Favor Llenar Formulario</h3>
                <div className="signup-form">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                        />
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Apellido"
                            required
                        />
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona</option>
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                        </select>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Teléfono"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                        <textarea
                            name="historial_clinico"
                            value={formData.historial_clinico}
                            onChange={handleChange}
                            placeholder="Historial Clínico (opcional)"
                        />
                        <div className="signup-form-input">
                            <label>Foto de perfil (opcional):</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="signup-form-button">Guardar</button>
                        </div>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>

            {/* Columna 1 vacía */}
            <div className="col empty-col"></div>
        </div>
    );
};