import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const SignupPatient = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        password: "",
        historial_clinico: ""  // Nuevo campo
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.createPatient(formData);
            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                gender: "",
                birth_date: "",
                phone_number: "",
                password: "",
                historial_clinico: ""  // Limpiar el nuevo campo
            });
            alert("Paciente registrado exitosamente");
            navigate("/loginpatient");
        } catch (error) {
            alert("Error: " + error.message);
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
                <h1 style={{ color: 'white', marginBottom: '30px' }}>Regístrate</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Apellido"
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
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
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                        style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
                    />
                    <textarea
                        name="historial_clinico"
                        value={formData.historial_clinico}
                        onChange={handleChange}
                        placeholder="Historial Clínico (opcional)"
                        style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '5px', height: '100px' }}
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
                        Continuar
                    </button>
                </form>
                <Link to="/" style={{ marginTop: '20px' }}>
                    <button style={{ 
                        padding: '10px 20px', 
                        backgroundColor: 'rgb(93 177 212)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}>
                        Back Home
                    </button>
                    <br></br>
                    <Link to="/loginpatient" href="#" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Ya tienes una cuenta? Inicia Sesión</Link>
                </Link>
            </div>
        </div>
    );
};