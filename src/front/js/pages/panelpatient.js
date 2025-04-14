import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";

export const PanelPatient = () => {
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

    useEffect(() => {
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        } else if (!store.currentPatient) {
            actions.getUserPatient();
        }
    }, []);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;
        try {
            await actions.deletePatientAccount();
            navigate("/loginpatient");
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
        }
    };

    const patient = store.currentPatient;
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Paciente";
    const patientLocation = patient?.city ? `${patient.city}, ${patient.country || 'CA'}` : "San Francisco, CA";

    return (
        <>
            {store.authPatient || localStorage.getItem("tokenpatient") ? (
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
                            <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
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
                            <li>
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
                            </li>
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
                                <h2>Mi Perfil</h2>
                                <p className="text-muted">Aquí está tu información personal.</p>
                            </div>
                            <div className="d-flex align-items-center position-relative">
                                <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {patientLocation} - {currentTime}
                                </span>
                                {patient?.url ? (
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
                                                        padding: "10px 20px",
                                                        color: "#000",
                                                        border: "none",
                                                        background: "none",
                                                        width: "100%",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    <i className="bi bi-box-arrow-right me-2"></i>
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#97dbe7",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        {patientName.charAt(0).toUpperCase()}
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
                                                        padding: "10px 20px",
                                                        color: "#000",
                                                        border: "none",
                                                        background: "none",
                                                        width: "100%",
                                                        textAlign: "left",
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

                        {store.currentPatient ? (
                            <div className="row g-4">
                                {/* Sección de datos personales */}
                                <div className="col-md-6">
                                    <div 
                                        className="card shadow-sm"
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title" style={{ color: "#000" }}>Datos Personales</h5>
                                                <Link to="/patient_edit">
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            backgroundColor: "#97dbe7",
                                                            color: "#000",
                                                            minWidth: "100px",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        Editar
                                                    </button>
                                                </Link>
                                            </div>
                                            {patient?.url && (
                                                <div className="text-center mb-3">
                                                    <img
                                                        src={patient.url}
                                                        alt="Foto de perfil"
                                                        style={{ 
                                                            width: "150px", 
                                                            height: "150px", 
                                                            borderRadius: "50%",
                                                            border: "3px solid #97dbe7"
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <h6 style={{ color: "#000" }}>{patientName}</h6>
                                            <p className="card-text" style={{ color: "#000" }}>
                                                <strong>Email:</strong> {patient.email}<br />
                                                <strong>Teléfono:</strong> {patient.phone_number}<br />
                                                <strong>Género:</strong> {
                                                String(patient.gender).toLowerCase() === 'male' ? 'Hombre' : 
                                                String(patient.gender).toLowerCase() === 'female' ? 'Mujer' : 
                                                'No especificado'
                                                }<br />
                                                <p>
                                                <strong>Fecha Nacimiento:</strong>{" "}
                                                {patient.birth_date
                                                ? new Date(patient.birth_date).toLocaleDateString("es-ES", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    })
                                                : ""}
                                                </p>
                                            </p>
                                        </div>
                                    </div>


<div 
                                        className="card shadow-sm"
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title" style={{ color: "#000" }}>Historial Clinico</h5>
                                            </div>
                                            <p className="card-text" style={{ color: "#000" }}>
                                               <strong>Su Informacion:</strong> {patient.historial_clinico}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Botón "Delete Account" */}
                                <div className="col-12 mt-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="btn"
                                        style={{ 
                                            backgroundColor: "rgb(173 29 29)", 
                                            color: "#fff",
                                            border: "1px solid #000"
                                        }}
                                    >
                                        Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>Cargando datos...</p>
                        )}
                    </div>
                </div>
            ) : (
                <Navigate to="/loginpatient" />
            )}

            {/* Añadir estilos personalizados para el resaltado */}
            <style>{`
                .nav-link.active {
                    background-color: #f0faff !important;
                    color: #000 !important;
                }
            `}</style>
        </>
    );
};