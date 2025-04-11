import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom"; // Añadimos useLocation
import logo from "../../img/logo.png";

export const PanelDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ruta actual
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
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else if (!store.doctorPanelData) {
            actions.getDoctorPanel();
        }
    }, [store.authDoctor, store.doctorPanelData, navigate]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;
        try {
            await actions.deleteDoctorAccount();
            navigate("/logindoctor");
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
        }
    };

    const doctor = store.doctorPanelData?.doctor;
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor";
    const doctorLocation = doctor?.city ? `${doctor.city}, ${doctor.country || 'CA'}` : "San Francisco, CA"; // Renombramos a doctorLocation

    return (
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
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
                            href="/dashboarddoctor"
                            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                        >
                            <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
                        </a>
                        <hr />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <Link
                                    to="/dashboarddoctor"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/dashboarddoctor" ? "active" : ""
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
                                    to="/doctor-appointment"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/doctor-appointment" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-calendar-check me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Ver Mis Citas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/doctor_edit_specialty"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/doctor_edit_specialty" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-book me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Mis Especialidades
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/center_office_by_doctor"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/center_office_by_doctor" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-building me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Mis Oficinas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/paneldoctor"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/paneldoctor" ? "active" : ""
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
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn d-flex align-items-center"
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#000",
                                border: "1px solid #000",
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

                    {/* Contenido principal */}
                    <div
                        className="flex-grow-1 p-4"
                        style={{ backgroundColor: "#f0faff", color: "#000", marginLeft: "280px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Mi Perfil</h2>
                                <p className="text-muted">Aquí está tu información personal.</p>
                            </div>
                            <div className="d-flex align-items-center position-relative">
                                <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {doctorLocation} - {currentTime} {/* Usamos doctorLocation */}
                                </span>
                                {doctor?.url && (
                                    <div>
                                        <img
                                            src={doctor.url}
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
                                )}
                            </div>
                        </div>

                        {store.doctorPanelData ? (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title" style={{ color: "#000" }}>Datos Personales</h5>
                                                <Link to="/doctor_edit">
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
                                            {doctor?.url && (
                                                <div className="text-center mb-3">
                                                    <img
                                                        src={doctor.url}
                                                        alt="Foto de perfil"
                                                        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                                                    />
                                                </div>
                                            )}
                                            <h6 style={{ color: "#000" }}>{doctorName}</h6>
                                            <p className="card-text" style={{ color: "#000" }}>
                                                <strong>Email:</strong> {doctor.email}<br />
                                                <strong>Teléfono:</strong> {doctor.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card mb-4" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ color: "#000" }}>Especialidades</h5>
                                            {doctor.specialties && doctor.specialties.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {doctor.specialties.map((spec) => (
                                                        <li key={spec.id} style={{ color: "#000" }}>{spec.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p style={{ color: "#000" }}>No tienes especialidades asignadas.</p>
                                            )}
                                            <Link
                                                to="/doctor_edit_specialty"
                                                className="text-decoration-none"
                                                style={{ color: "#97dbe7" }}
                                            >
                                                Gestionar Especialidades <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ color: "#000" }}>Centros Médicos</h5>
                                            {doctor.medical_centers && doctor.medical_centers.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {doctor.medical_centers
                                                        .sort((a, b) => {
                                                            if (a.name < b.name) return -1;
                                                            if (a.name > b.name) return 1;
                                                            if (a.office < b.office) return -1;
                                                            if (a.office > b.office) return 1;
                                                            return 0;
                                                        })
                                                        .map((center) => (
                                                            <li key={center.id} style={{ color: "#000" }}>
                                                                {center.name} - Oficina: {center.office}
                                                            </li>
                                                        ))}
                                                </ul>
                                            ) : (
                                                <p style={{ color: "#000" }}>No tienes centros médicos asignados.</p>
                                            )}
                                            <Link
                                                to="/center_office_by_doctor"
                                                className="text-decoration-none"
                                                style={{ color: "#97dbe7" }}
                                            >
                                                Gestionar Centros <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="btn btn-danger"
                                        style={{ backgroundColor: "rgb(173 29 29)", border: "none" }}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>Cargando datos...</p>
                        )}
                    </div>
                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}
        </>
    );
};

// Añadir estilos personalizados para el resaltado
const styles = `
    .nav-link.active {
        background-color: #f0faff !important; /* Color gris claro */
        color: #000 !important; /* Cambiar el color del texto a negro para que sea legible */
    }
`;

// Inyectar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);