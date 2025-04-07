import React, { useContext ,useEffect, useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export const LoginDoctor = () => {

    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

        const handleSubmit = async (e) => {
        e.preventDefault();
            try {
                await actions.loginDoctor(email, password);
                navigate("/dashboarddoctor"); 
            } catch (error) {
                alert("Error al iniciar sesión: " + (store.loginDoctorError || "Inténtalo de nuevo"));
            }
        };
   
	return (

        <div className="container">
                <div className="container d-flex justify-content-center align-items-center"></div>
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
                <button type="submit">Login</button>
            </form>
            {store.loginDoctorError && <p style={{ color: "red" }}>{store.loginDoctorError}</p>}

        <br />

        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>

        <Link to="/registrationdoctor">
        <button className="btn btn-success">Registrate</button>
        </Link>

        </div>


    );
};