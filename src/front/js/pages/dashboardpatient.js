import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";
import robot3D from "../../img/robot3D.png";

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://animatedicons.co/scripts/embed-animated-icons.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
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
    }

    return (
        <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#b7f4ff" }}>
            {/* Sidebar */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}>
                <a href="/dashboardpatient" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <img src={logo} alt="Logo de Mi Sitio" style={{ height: '100px', width: '100%' }} />
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/dashboardpatient" className="nav-link active text-white">
                            <i className="bi bi-house-door me-2"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/panelpatient" className="nav-link text-white">
                            <i className="bi bi-person me-2"></i>
                            Mi Perfil
                        </Link>
                    </li>
                    <li>
                        <Link to="/miscitas" className="nav-link text-white">
                            <i className="bi bi-calendar-check me-2"></i>
                            Mis Citas
                        </Link>
                    </li>
                    <li>
                        <Link to="/search-professionals" className="nav-link text-white">
                            <i className="bi bi-search me-2"></i>
                            Buscar Profesional
                        </Link>
                    </li>
                </ul>
                <hr />
                <button onClick={handleLogout} className="btn" style={{ backgroundColor: "#97dbe7", color: "#000", border: "none" }}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-grow-1 p-4" style={{ backgroundColor: "#b7f4ff", color: "#000" }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2>Hola, {patientName}</h2>
                        <p className="text-muted">Aquí tienes un resumen de tu actividad reciente.</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                            <i className="bi bi-geo-alt me-1"></i>
                            {patientLocation} - {currentTime}
                        </span>
                        {patient?.url && (
                            <img
                                src={patient.url}
                                alt="Foto de perfil"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    border: "2px solid #97dbe7",
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Tarjetas */}
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-calendar-check fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                    <h5 className="card-title mb-0">Mis Citas</h5>
                                </div>
                                <h3 className="card-text">{patient?.appointments?.length || 0}</h3>
                                <Link to="/miscitas" className="text-decoration-none" style={{ color: "#97dbe7" }}>
                                    Ver detalles <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-chat-dots fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                    <h5 className="card-title mb-0">Consultar con IA</h5>
                                </div>
                                <h3 className="card-text">Disponible</h3>
                                <Link to="/ai-consultation" className="text-decoration-none" style={{ color: "#97dbe7" }}>
                                    Comenzar <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-person fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                    <h5 className="card-title mb-0">Mi Perfil</h5>
                                </div>
                                <h3 className="card-text">Editar</h3>
                                <Link to="/panelpatient" className="text-decoration-none" style={{ color: "#97dbe7" }}>
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