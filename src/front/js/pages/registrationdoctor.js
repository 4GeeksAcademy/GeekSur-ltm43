import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";
import login_doctor from "../../img/Login_Doctor.jpg";
import "../../styles/signup.css";

export const RegistrationDoctor = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
    });
    const [photo, setPhoto] = useState(null); // Estado para la imagen

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]); // Guardar el archivo seleccionado
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
                data.append("photo", photo); // Agregar la imagen al FormData
            }

            const newDoctor = await actions.createDoctor(data);
            console.log("Doctor creado:", newDoctor);

            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                password: "",
            });
            setPhoto(null); // Limpiar el campo de la imagen
            navigate("/logindoctor");
        } catch (error) {
            setError(error.message || "Error al registrar doctor");
            console.error("Error al registrar doctor:", error.message);
        }
    };

    return (
        <div className="container_register">

            {/* Columna 1 vacía */}
            <div className="col empty-col"></div>

            <div className="left">
                <div className="signup-info">
                    <div className="logo-container">
                        <img src={login_doctor} alt="MedGeek Login" className="login-image" />
                    </div>
                </div>
            </div>

            <div className="right">
            <h3>Favor Llenar Formulario</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
                     <input
                        className="signup-form-input"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                         placeholder="Nombre"
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                         placeholder="Apellido"
                        onChange={handleChange}
                        required
                    />
                      <input
                        className="signup-form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                         placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                      <input
                        className="signup-form-input"
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                         placeholder="Telefono"
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                    <div className="signup-form-input">
                        <label>Foto de perfil:</label>
                        <input
                            className="signup-form-input"
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


            {/* Columna 1 vacía */}
            <div className="col empty-col"></div>

            </div>

    );
};

