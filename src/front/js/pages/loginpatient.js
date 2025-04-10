import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";
import login_patient from "../../img/Login_Patient.jpg";  

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
    <div className="login-grid">
      
      {/* Columna 1 vacía */}
      <div className="col empty-col"></div>
  
      {/* Columna 2: Imagen */}
      <div className="col image-col">
        <div className="login-image-container">
          <img src={login_patient} alt="MedGeek Login" className="login-image" />
        </div>
      </div>
  
      {/* Columna 3: Formulario */}
      <div className="col form-col">
        <div className="login-form">
          <div className="logo-container">
            <img src={logo} alt="MedGeek Logo" className="logo" />
          </div>

          <h2>
            Mi Portal: <strong>Pacientes</strong>
          </h2>
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
            <button type="submit" className="sent">Login</button>
          </form>
  
          {store.loginPatientError && (
            <p className="error">{store.loginPatientError}</p>
          )}
  
          <div className="login-buttons">
            <p className="register-message">
              ¿No tiene cuenta? Favor haga clic en{" "}
              <Link to="/signuppatient" className="register-link">
                registrarse
              </Link>
            </p>
          </div>
        </div>
      </div>
  
      {/* Columna 4 vacía */}
      <div className="col empty-col"></div>
  
    </div>
  );
};
