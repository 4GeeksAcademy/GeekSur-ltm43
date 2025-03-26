import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const LoginPatient = () => {
    const { actions, store } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.loginPatient(email, password);
            navigate("/dashboardpatient"); // Redirigir al dashboard tras login exitoso
        } catch (error) {
            alert("Error al iniciar sesión: " + (store.loginPatientError || "Inténtalo de nuevo"));
        }
    };

    return (
        <div className="container">
            <h1>Iniciar Sesión - Paciente</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
            {store.loginPatientError && <p style={{ color: "red" }}>{store.loginPatientError}</p>}

        <br />
        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>


        </div>
    );
};