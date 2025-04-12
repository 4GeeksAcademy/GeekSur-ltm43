// import React, { useEffect, useState, useContext } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, Navigate, Link } from "react-router-dom";
// import logo from "../../img/logo.png";
// import robot3D from "../../img/robot3D.png";


// export const DashboardPatient = () => {
//     const { store, actions } = useContext(Context);
//     const navigate = useNavigate();

//     const [currentTime, setCurrentTime] = useState(
//         new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
//         }, 60000);
//         return () => clearInterval(interval);
//     }, []);


//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://animatedicons.co/scripts/embed-animated-icons.js';
//         script.async = true;
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     const handleLogout = () => {
//         actions.logoutPatient();
//         navigate("/loginpatient");
//     };

//     const patient = store.currentPatient;
//     const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Paciente";
//     const patientLocation = patient ? `${patient.city || "San Francisco"}, ${patient.country || "CA"}` : "San Francisco, CA";


//     if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
//         return <Navigate to="/loginpatient" />;
//     };

//     return (

//         <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>

//             {/* Sidebar */}
//             <div className="d-flex flex-column flex-shrink-0 p-3 text-white" 
            
//             style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" 

//             }} >
//                 <a href="/dashboardpatient" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
//                     <img src={logo} alt="Logo de Mi Sitio" style={{ height: '100px', width: '100%' }} />
//                 </a>
//                 <hr />
//                 <ul className="nav nav-pills flex-column mb-auto">
//                     <li className="nav-item">
//                         <Link to="/dashboardpatient" className="nav-link active text-white">
//                             <i className="bi bi-house-door me-2"></i>
//                             Dashboard
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/panelpatient" className="nav-link text-white">
//                             <i className="bi bi-person me-2"></i>
//                             Mi Perfil
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/miscitas" className="nav-link text-white">
//                             <i className="bi bi-calendar-check me-2"></i>
//                             Mis Citas
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/search-professionals" className="nav-link text-white">
//                             <i className="bi bi-search me-2"></i>
//                             Buscar Profesional
//                         </Link>
//                     </li>
//                 </ul>
//                 <hr />
//                 <button onClick={handleLogout} className="btn" style={{ backgroundColor: "#97dbe7", color: "#000", border: "none" }}>
//                     <i className="bi bi-box-arrow-right me-2"></i>
//                     Cerrar Sesión
//                 </button>
//             </div>

//             {/* Contenido principal */}
//             <div className="flex-grow-1 p-4" style={{ backgroundColor: "#b7f4ff", color: "#000" }}>
//                 {/* Header */}
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <div>
//                         <h2>Hola, {patientName}</h2>
//                         <p className="text-muted">Aquí tienes un resumen de tu actividad reciente.</p>
//                     </div>
//                     <div className="d-flex align-items-center">
//                         <span className="text-dark me-3" style={{ opacity: 0.8 }}>
//                             <i className="bi bi-geo-alt me-1"></i>
//                             {patientLocation} - {currentTime}
//                         </span>
//                         {patient?.url && (
//                             <img
//                                 src={patient.url}
//                                 alt="Foto de perfil"
//                                 style={{
//                                     width: "40px",
//                                     height: "40px",
//                                     borderRadius: "50%",
//                                     border: "2px solid #97dbe7",
//                                 }}
//                             />
//                         )}
//                     </div>
//                 </div>

//                 {/* Tarjetas */}
//                 <div className="row g-4">
//                     <div className="col-md-4">
//                         <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
//                             <div className="card-body">
//                                 <div className="d-flex align-items-center mb-3">
//                                     <i className="bi bi-calendar-check fs-3 me-3" style={{ color: "#97dbe7" }}></i>
//                                     <h5 className="card-title mb-0">Mis Citas</h5>
//                                 </div>
//                                 <h3 className="card-text">{patient?.appointments?.length || 0}</h3>
//                                 <Link to="/miscitas" className="text-decoration-none" style={{ color: "#97dbe7" }}>
//                                     Ver detalles <i className="bi bi-arrow-right"></i>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-md-4">
//                         <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
//                             <div className="card-body">
//                                 <div className="d-flex align-items-center mb-3">
//                                     <i className="bi bi-chat-dots fs-3 me-3" style={{ color: "#97dbe7" }}></i>
//                                     <h5 className="card-title mb-0">Consultar con IA</h5>
//                                 </div>
//                                 <h3 className="card-text">Disponible</h3>
//                                 <Link to="/ai-consultation" className="text-decoration-none" style={{ color: "#97dbe7" }}>
//                                     Comenzar <i className="bi bi-arrow-right"></i>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-md-4">
//                         <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
//                             <div className="card-body">
//                                 <div className="d-flex align-items-center mb-3">
//                                     <i className="bi bi-person fs-3 me-3" style={{ color: "#97dbe7" }}></i>
//                                     <h5 className="card-title mb-0">Mi Perfil</h5>
//                                 </div>
//                                 <h3 className="card-text">Editar</h3>
//                                 <Link to="/panelpatient" className="text-decoration-none" style={{ color: "#97dbe7" }}>
//                                     Ir al perfil <i className="bi bi-arrow-right"></i>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Botón flotante IA */}
//                 <div style={{
//                     position: 'fixed',
//                     bottom: '20px',
//                     right: '20px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'flex-end',
//                     zIndex: 9999
//                 }}>
//                     <span style={{
//                         marginRight: '10px',
//                         fontSize: '14px',
//                         fontWeight: 'bold',
//                         backgroundColor: '#fff',
//                         padding: '6px 10px',
//                         borderRadius: '8px',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//                         borderBottom: '2px solid black'
//                     }}>
//                         chatea con nuestro boti
//                     </span>
//                     <Link to="/ai-consultation">
//                         <img
//                             src={robot3D}
//                             alt="Chatbot"
//                             style={{
//                                 width: "100px",
//                                 height: "100px",
//                                 cursor: "pointer",
//                                 transition: "transform 0.3s",
//                             }}
//                             onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
//                             onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
//                         />
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import logo from "../../img/logo.png";
import robot3D from "../../img/robot3D.png";

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const patient = store.currentPatient;
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Paciente";
    const patientLocation = patient ? `${patient.city || "San Francisco"}, ${patient.country || "CA"}` : "San Francisco, CA";

    if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
        return <Navigate to="/loginpatient" />;
    };

    return (
        <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
            {/* Sidebar fijo */}
            <div
                className="d-flex flex-column flex-shrink-0 py-3 text-white"
                style={{
                    width: "280px",
                    backgroundColor: "rgb(100, 191, 208)",
                    position: "fixed",
                    height: "100vh",
                    overflowY: "auto",
                }}
            >
                <a
                    href="/dashboardpatient"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                    <img src={logo} alt="Logo de Mi Sitio" style={{ height: "100px", width: "100%" }} />
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link
                            to="/dashboardpatient"
                            className={`nav-link text-white d-flex align-items-center ${
                                location.pathname === "/dashboardpatient" ? "active" : ""
                            }`}
                            style={{
                                padding: "10px 0",
                                margin: "0 -15px",
                                borderRadius: "0",
                            }}
                        >
                            <i className="bi bi-house-door me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/panelpatient"
                            className={`nav-link text-white d-flex align-items-center ${
                                location.pathname === "/panelpatient" ? "active" : ""
                            }`}
                            style={{
                                padding: "10px 0",
                                margin: "0 -15px",
                                borderRadius: "0",
                            }}
                        >
                            <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Mi Perfil
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/patient-appointments"
                            className={`nav-link text-white d-flex align-items-center ${
                                location.pathname === "/patient-appointments" ? "active" : ""
                            }`}
                            style={{
                                padding: "10px 0",
                                margin: "0 -15px",
                                borderRadius: "0",
                            }}
                        >
                            <i className="bi bi-calendar-check me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Mis Citas
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/search-professionals"
                            className={`nav-link text-white d-flex align-items-center ${
                                location.pathname === "/search-professionals" ? "active" : ""
                            }`}
                            style={{
                                padding: "10px 0",
                                margin: "0 -15px",
                                borderRadius: "0",
                            }}
                        >
                            <i className="bi bi-search me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Buscar Profesional
                        </Link>
                    </li>
                    <Link
                            to="/ai-consultation"
                            className={`nav-link text-white d-flex align-items-center ${
                                location.pathname === "/ai-consultation" ? "active" : ""
                            }`}
                            style={{
                                padding: "10px 0",
                                margin: "0 -15px",
                                borderRadius: "0",
                            }}
                        >
                            <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Habla Con Boti IA
                        </Link>
                </ul>
                <hr />
                <button
                    onClick={handleLogout}
                    className="btn d-flex align-items-center"
                    style={{
                        backgroundColor: "#97dbe7",
                        color: "#000",
                        minWidth: "100px",
                        whiteSpace: "nowrap",
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "500",
                         whiteSpace: "nowrap",
                         width: "fit-content",
                         maxWidth: "100%",
                         margin: "0 auto",
                    }}
                >
                    <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                    Cerrar Sesión
                </button>
            </div>

            {/* Contenido principal con margen para el sidebar fijo */}
            <div
                className="flex-grow-1 p-4"
                style={{
                    backgroundColor: "#f0faff",
                    color: "#000",
                    marginLeft: "280px",
                }}
            >
                {/* Header con hora dinámica y dropdown en la foto de perfil */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2>Hola, {patientName}</h2>
                        <p className="text-muted">Aquí tienes un resumen de tu actividad reciente.</p>
                    </div>
                    <div className="d-flex align-items-center position-relative">
                        <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                            <i className="bi bi-geo-alt me-1"></i>
                            {patientLocation} - {currentTime}
                        </span>
                        {patient?.url && (
                            <div>
                                <img
                                    src={patient.url}
                                    alt="Foto de perfil"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        border: "2px solid #97dbe7",
                                        cursor: "pointer",
                                    }}
                                />
                                {showDropdown && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "50px",
                                            right: "0",
                                            backgroundColor: "#fff",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "5px",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                            zIndex: 1000,
                                        }}
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="btn d-flex align-items-center"
                                            style={{
                                                backgroundColor: "#97dbe7",
                                                color: "#000",
                                                minWidth: "100px",
                                                whiteSpace: "nowrap",
                                                padding: "10px",
                                                borderRadius: "5px",
                                                fontWeight: "500",
                                                 whiteSpace: "nowrap",
                                                 width: "fit-content",
                                                 maxWidth: "100%",
                                                 margin: "0 auto",
                                            }}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tarjetas de métricas/acciones */}
                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div
                            className="card shadow-sm"
                            style={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                            }}
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i
                                        className="bi bi-calendar-check fs-3 me-3"
                                        style={{ color: "#97dbe7" }}
                                    ></i>
                                    <h5 className="card-title mb-0" style={{ color: "#000" }}>
                                        Mis Citas
                                    </h5>
                                </div>
                                <h3 className="card-text" style={{ color: "#000" }}>
                                    {patient?.appointments?.length || 0}
                                </h3>
                                <Link
                                    to="/patient-appointments"
                                    className="text-decoration-none"
                                    style={{ color: "#97dbe7" }}
                                >
                                    Ver detalles <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="card shadow-sm"
                            style={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                            }}
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i
                                        className="bi bi-chat-dots fs-3 me-3"
                                        style={{ color: "#97dbe7" }}
                                    ></i>
                                    <h5 className="card-title mb-0" style={{ color: "#000" }}>
                                        Consultar con IA
                                    </h5>
                                </div>
                                <h3 className="card-text" style={{ color: "#000" }}>Habla Con Boti!</h3>
                                <Link
                                    to="/ai-consultation"
                                    className="text-decoration-none"
                                    style={{ color: "#97dbe7" }}
                                >
                                    Comenzar <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="card shadow-sm"
                            style={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                            }}
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i
                                        className="bi bi-person fs-3 me-3"
                                        style={{ color: "#97dbe7" }}
                                    ></i>
                                    <h5 className="card-title mb-0" style={{ color: "#000" }}>
                                        Mi Perfil
                                    </h5>
                                </div>
                                <h3 className="card-text" style={{ color: "#000" }}>Editar</h3>
                                <Link
                                    to="/panelpatient"
                                    className="text-decoration-none"
                                    style={{ color: "#97dbe7" }}
                                >
                                    Ir al perfil <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón flotante IA */}
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    zIndex: 9999
                }}>
                    <span style={{
                        marginRight: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        backgroundColor: '#fff',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        borderBottom: '2px solid black'
                    }}>
                        chatea con nuestro boti
                    </span>
                    <Link to="/ai-consultation">
                        <img
                            src={robot3D}
                            alt="Chatbot"
                            style={{
                                width: "100px",
                                height: "100px",
                                cursor: "pointer",
                                transition: "transform 0.3s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Añadir estilos personalizados para el resaltado
const styles = `
    .nav-link.active {
        background-color: #f0faff !important;
        color: #000 !important;
    }
`;

// Inyectar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);