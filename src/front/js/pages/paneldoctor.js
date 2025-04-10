import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";

export const PanelDoctor = () => {
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
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else if (!store.doctorPanelData) {
            actions.getDoctorPanel();
        }
    }, [store.authDoctor, store.doctorPanelData, actions, navigate]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;
        try {
            await actions.deleteDoctorAccount(); // Asumimos que esta acción existe en el contexto
            navigate("/logindoctor");
        } catch (error) {
            console.error("Error al eliminar la cuenta:", error);
        }
    };

    const doctor = store.doctorPanelData?.doctor;
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor";
    const location = doctor?.city ? `${doctor.city}, ${doctor.country || 'CA'}` : "San Francisco, CA";

    return (
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
                <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
                    {/* Sidebar */}
                    <div
                        className="d-flex flex-column flex-shrink-0 p-3 text-white"
                        style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}
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
                                <Link to="/dashboarddoctor" className="nav-link text-white">
                                    <i className="bi bi-house-door me-2"></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/doctor-appointment" className="nav-link text-white">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Ver Mis Citas
                                </Link>
                            </li>
                            <li>
                                <Link to="/doctor_edit_specialty" className="nav-link text-white">
                                    <i className="bi bi-book me-2"></i>
                                    Mis Especialidades
                                </Link>
                            </li>
                            <li>
                                <Link to="/center_office_by_doctor" className="nav-link text-white">
                                    <i className="bi bi-building me-2"></i>
                                    Mis Oficinas
                                </Link>
                            </li>
                            <li>
                                <Link to="/paneldoctor" className="nav-link active text-white">
                                    <i className="bi bi-person me-2"></i>
                                    Mi Perfil
                                </Link>
                            </li>
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn d-flex align-items-center"
                            style={{
                                backgroundColor: "#ffffff", // Fondo blanco para mejor contraste
                                color: "#000", // Texto negro
                                border: "1px solid #000", // Borde negro para definición
                                padding: "10px",
                                borderRadius: "5px",
                                fontWeight: "500", // Texto un poco más grueso
                                whiteSpace: "nowrap", // Previene salto de línea
                                width: "fit-content", // Ancho ajustado al contenido
                                maxWidth: "100%",
                            }}
                        >
                            <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f0faff", color: "#000" }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Mi Perfil</h2>
                                <p className="text-muted">Aquí está tu información personal.</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {location} - {currentTime}
                                </span>
                                {doctor?.url && (
                                    <img
                                        src={doctor.url}
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

                        {store.doctorPanelData ? (
                            <div className="row g-4">
                                {/* Sección de datos personales */}
                                <div className="col-md-6">
                                    <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title" style={{ color: "#000" }}>Datos Personales</h5>
                                                <Link to="/doctor_edit">
                                                    <button className="btn btn-sm" style={{ backgroundColor: "#97dbe7", color: "#000" }}>
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

                                {/* Sección de especialidades y centros médicos */}
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

                                {/* Botón "Delete Account" */}
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