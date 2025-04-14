// import React, { useContext, useState } from "react";
// import { Context } from "../store/appContext";
// import "../../styles/login.css";
// import { useNavigate, Link } from "react-router-dom";
// import logo from "../../img/meedgeeknegro.png";
// import login_doctor from "../../img/Login_Doctor.jpg";


// export const LoginDoctor = () => {
//   const { store, actions } = useContext(Context);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await actions.loginDoctor(email, password);
//       navigate("/dashboarddoctor");
//     } catch (error) {
//       alert("Error al iniciar sesión: " + (store.loginDoctorError || "Inténtalo de nuevo"));
//     }
//   };

//   return (
//     <div className="login-grid">
      
//       {/* Columna 1 vacía */}
//       <div className="col empty-col"></div>
  
//       {/* Columna 2: Imagen */}
//       <div className="col image-col">
//         <div className="login-image-container">
//           <img src={login_doctor} alt="MedGeek Login" className="login-image" />
//         </div>
//       </div>
  
//       {/* Columna 3: Formulario */}
//       <div className="col form-col">

//        <div className="login-form">
//         <div className="logo-container">
//            <img src={logo} alt="MedGeek Logo" className="logo" />
//           </div>
//           <h2>
//             Mi Portal: <strong>Médicos</strong>
//           </h2>
//           <p>Ingresa tu Email y Clave para iniciar sesión</p>
  
//           <form onSubmit={handleSubmit}>
//             <div>
//               <label>Email:</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label>Contraseña:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="sent" >Login</button>
//           </form>
  
//           {store.loginDoctorError && (
//             <p className="error">{store.loginDoctorError}</p>
//           )}
  
//           <div className="login-buttons">

//             <p className="register-message">
//               ¿No tiene cuenta? Favor haga clic en{" "}
//               <Link to="/registrationdoctor" className="register-link">
//                 registrarse
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
  
//       {/* Columna 4 vacía */}
//       <div className="col empty-col"></div>
  
//     </div>
//   );
// };
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";
import login_doctor from "../../img/Login_Doctor.jpg";

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
      <div className="login-card">
        
        {/* Lado izquierdo: imagen */}
        <div className="login-illustration">
          <img src={login_doctor} alt="Login Doctor" />
        </div>

        {/* Lado derecho: formulario */}
        <div className="login-form-side">
          <div className="login-form">
            <div className="logo-container">
              <img src={logo} alt="MedGeek Logo" className="logo" />
            </div>

            <h2>Mi Portal: <strong>Médicos</strong></h2>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label>
                  <input type="checkbox" /> Recordarme
                </label>
                <Link to="/forgotpassword" style={{ fontSize: '0.9rem' }}>¿Olvidaste tu clave?</Link>
              </div>

              <button type="submit" className="sent">Login</button>
            </form>

            {store.loginDoctorError && (
              <p className="error">{store.loginDoctorError}</p>
            )}

            <div className="login-buttons">
              <div className="social-button google">Iniciar sesión con Google</div>
              <div className="social-button facebook">Iniciar sesión con Facebook</div>
            </div>

            <p className="register-message">
              ¿No tiene cuenta? Favor haga clic en{" "}
              <Link to="/registrationdoctor" className="register-link">
                registrarse
              </Link>
            </p>

            <p className="copyright">©2025 MedGeek. </p>
          </div>
        </div>
      </div>
    </div>
  );
};
