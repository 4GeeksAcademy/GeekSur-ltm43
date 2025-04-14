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
      <div className="login-container">
        <div className="login-card">
          {/* Imagen ilustrada */}
          <div className="login-illustration">
            <img src={login_patient} alt="Login Illustration" />
          </div>
    
          {/* Formulario */}
          <div className="login-form-side">
            <div className="login-form">
              <div className="logo-container">
                <img src={logo} alt="MedGeek Logo" className="logo" />
              </div>
    
              <h2>Bienvenido!</h2>
              <p>Nuevo aquí? <Link to="/signuppatient">Crear una cuenta</Link></p>
    
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label>
                    <input type="checkbox" /> Recuérdame
                  </label>
                  <Link to="/forgotpassword" style={{ fontSize: '0.9rem' }}>Olvidaste tu contraseña?</Link>
                </div>
    
                <button type="submit" className="sent">Login</button>
              </form>
    
              {store.loginPatientError && (
                <p className="error">{store.loginPatientError}</p>
              )}
    
              <div className="login-buttons">
                <div className="social-button google">Iniciar con Google</div>
                <div className="social-button facebook">Iniciar con Facebook</div>
              </div>
    
              <p className="copyright">©2025 MedGeek.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }   