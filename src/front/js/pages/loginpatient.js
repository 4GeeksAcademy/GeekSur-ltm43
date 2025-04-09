import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";

export const LoginPatient = () => {
  const { store, actions } = useContext(Context);
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
    <div className="login-container">
      <div className="login-info">
        
        <div className="logo-container">
                <img src={logo} alt="MedGeek Logo" className="logo" />
        </div>

        <div className="info-box">
          <h1>Portal MedGeek para Pacientes</h1>
          <h3>Cada mes, miles de pacientes agendan su cita medica usando MedGeek.</h3>
          <ul>
            <li>Agenda tus citas médicas</li>
            <li>Buscador de Profesionales</li>
            <li>Consulta con nuestra Inteligencia Artificial</li>
            <li>Consulta tu historial médico</li>
            <li>Y más...</li>
          </ul>
        </div>
      </div>

      <div className="login-form">



        <div className="logo-container"> 
  

  

    
    </div>

        <h1>
          Mi <strong>Portal: Pacientes</strong>
        </h1>
        <p>Ingresa tu Email y Clave para iniciar sesión</p>

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

        {store.loginPatientError && <p className="error">{store.loginPatientError}</p>}

        <div className="login-buttons">
          <p className="register-message">¿No tiene cuenta? Favor haga clic en registrarse</p>

          <div className="button-group">
            <Link to="/signuppatient">
              <button className="btn">Registrarse</button>
            </Link>
            <Link to="/">
              <button className="btn">Volver</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};