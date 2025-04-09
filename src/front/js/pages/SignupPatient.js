import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/meedgeeknegro.png";
import "../../styles/signup.css";

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
        historial_clinico: ""
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
                historial_clinico: ""
            });
            alert("Paciente registrado exitosamente");
            navigate("/loginpatient");
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        
            <div className="container_register" style={{
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
                    <div className="container">

                        <div className="left">
                            <div className="signup-info">
                                <div className="logo-container">
                                    <img src={logo} alt="MedGeek Logo" className="logo" />
                                </div>

                            </div>
                        </div>
                        <div className="right">
                            <h3>Favor Llenar Formulario</h3>

                            <div className="signup-form">
                                <form onSubmit={handleSubmit}>
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

                                    <div className="button-group">
                                        <button type="submit">Guardar</button>
                                        <Link to="/">
                                            <button type="button">Home</button>
                                        </Link>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        );
};
