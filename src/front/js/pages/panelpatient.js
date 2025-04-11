import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";

export const PanelPatient = () => {
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
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        } else if (!store.currentPatient) {
            actions.getUserPatient();
        }
    }, [store.authPatient, actions, navigate]);

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
                <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#b7f4ff" }}>
                    {/* Sidebar */}
                    <div
                        className="d-flex flex-column flex-shrink-0 p-3 text-white"
                        style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}
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
                                <Link to="/dashboardpatient" className="nav-link text-white">
                                    <i className="bi bi-house-door me-2"></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/patient-appointments" className="nav-link text-white">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Ver Mis Citas
                                </Link>
                            </li>
                            <li>
                                <Link to="/patient_edit_specialty" className="nav-link text-white">
                                    <i className="bi bi-book me-2"></i>
                                    Mis Especialidades
                                </Link>
                            </li>
                            <li>
                                <Link to="/patient_medical_centers" className="nav-link text-white">
                                    <i className="bi bi-building me-2"></i>
                                    Mis Centros Médicos
                                </Link>
                            </li>
                            <li>
                                <Link to="/panelpatient" className="nav-link active text-white">
                                    <i className="bi bi-person me-2"></i>
                                    Mi Perfil
                                </Link>
                            </li>
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn"
                            style={{ backgroundColor: "#97dbe7", color: "#000", border: "none" }}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-grow-1 p-4" style={{ backgroundColor: "#b7f4ff", color: "#000" }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Mi Perfil</h2>
                                <p className="text-muted">Aquí está tu información personal.</p>
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

                        {store.currentPatient ? (
                            <div className="row g-4">
                                {/* Sección de datos personales */}
                                <div className="col-md-6">
                                    <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title" style={{ color: "#000" }}>Datos Personales</h5>
                                                <Link to="/patient_edit">
                                                    <button className="btn btn-sm" style={{ backgroundColor: "#97dbe7", color: "#000" }}>
                                                        Editar
                                                    </button>
                                                </Link>
                                            </div>
                                            {patient?.url && (
                                                <div className="text-center mb-3">
                                                    <img
                                                        src={patient.url}
                                                        alt="Foto de perfil"
                                                        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                                                    />
                                                </div>
                                            )}
                                            <h6 style={{ color: "#000" }}>{patientName}</h6>
                                            <p className="card-text" style={{ color: "#000" }}>
                                                <strong>Email:</strong> {patient.email}<br />
                                                <strong>Teléfono:</strong> {patient.phone_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sección de especialidades y centros médicos */}
                                <div className="col-md-6">
                                    <div className="card mb-4" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ color: "#000" }}>Especialidades</h5>
                                            {patient.specialties && patient.specialties.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {patient.specialties.map((spec) => (
                                                        <li key={spec.id} style={{ color: "#000" }}>{spec.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p style={{ color: "#000" }}>No tienes especialidades asignadas.</p>
                                            )}
                                            <Link
                                                to="/patient_edit_specialty"
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
                                            {patient.medical_centers && patient.medical_centers.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {patient.medical_centers
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
                                                to="/patient_medical_centers"
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
                <Navigate to="/loginpatient" />
            )}
        </>
    );
};