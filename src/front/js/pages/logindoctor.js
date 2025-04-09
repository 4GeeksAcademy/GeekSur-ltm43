import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";

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
    <div className="login-container">
      <div className="login-info">
        <div className="logo-container">
                <img src={logo} alt="MedGeek Logo" className="logo" />
        </div>
        <div className="info-box">
          <h1>Portal MedGeek, Configurá tu cuenta aqui.</h1>
          <h3>Cada mes, miles de pacientes agendan usando MedGeek..</h3>
          <ul>
            <li>Gestiona tus citas médicas</li>
            <li>Gestiona tus Centros Médicos</li>
            <li>Gestiona tus Especialidades</li>
            <li> y Mas......</li>
          </ul>
        </div>
      </div>

      <div className="login-form">
        <h1>
          Mi <strong>Portal: Medicos</strong>
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

        {store.loginDoctorError && <p className="error">{store.loginDoctorError}</p>}

        <div className="login-buttons">
                <p className="register-message">¿No tiene cuenta? Favor haga clic en registrarse</p>
                <div className="button-group">
                    <Link to="/registrationdoctor">
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
