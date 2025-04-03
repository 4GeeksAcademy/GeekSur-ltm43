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
            navigate("/dashboardpatient");
        } catch (error) {
            alert("Error al iniciar sesión: " + (store.loginPatientError || "Inténtalo de nuevo"));
        }
    };

    return (
        <div className="container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: 'rgb(225 250 255)'
        }}>
            <div style={{ 
                backgroundColor: 'rgb(152 210 237)',
                padding: '40px', 
                borderRadius: '10px', 
                width: '500px', 
                textAlign: 'center' 
            }}>
                <h1 style={{ color: 'white', marginBottom: '30px' }}>¡Bienvenido!</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Usuario"
                        required
                        style={{ 
                            padding: '10px', 
                            marginBottom: '20px', 
                            border: 'none', 
                            borderRadius: '5px' 
                        }}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                        style={{ 
                            padding: '10px', 
                            marginBottom: '20px', 
                            border: 'none', 
                            borderRadius: '5px' 
                        }}
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: 'rgb(93 177 212)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Login
                    </button>
                </form>
                <div style={{ marginTop: '20px', color: 'white' }}>
                    <a 
                        href="#" 
                        onClick={() => navigate("/signuppatient")}
                        style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}
                    >
                        ¿No tienes cuenta? Regístrate aquí
                    </a>
                </div>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        marginTop: '30px', 
                        padding: '10px 20px', 
                        backgroundColor: 'rgb(93 177 212)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                >
                    Volver
                </button>
                {store.loginPatientError && <p style={{ color: "red", marginTop: '10px' }}>{store.loginPatientError}</p>}
            </div>
        </div>
    );
};