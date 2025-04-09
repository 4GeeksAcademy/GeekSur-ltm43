import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Estado para la hora actual
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    // Actualizar la hora cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000); // 60000 ms = 1 minuto

        return () => clearInterval(interval);
    }, []);

    // Cargar datos del doctor y centros médicos
    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            if (!store.doctorPanelData) {
                actions.getDoctorPanel();
            }
            if (!store.medical_center_doctor) {
                actions.getMedicalCenterDoctor();
            }
        }
        console.log("Datos de doctorPanelData:", store.doctorPanelData);
        console.log("Datos de medical_center_doctor:", store.medical_center_doctor);
    }, [store.authDoctor, store.doctorPanelData, store.medical_center_doctor, actions, navigate]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const doctor = store.doctorPanelData?.doctor;
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor";

    // Obtener la ciudad dinámicamente
    const medicalCenters = store.medical_center_doctor || [];
    const firstMedicalCenter = medicalCenters.length > 0 ? medicalCenters[0] : null;
    const city = doctor?.city || firstMedicalCenter?.city || "San Francisco";
    const country = doctor?.country || firstMedicalCenter?.country || "CA";
    const location = `${city}, ${country}`;

    return (
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
                <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#b7f4ff" }}>
                    {/* Sidebar */}
                    <div
                        className="d-flex flex-column flex-shrink-0 p-3 text-white"
                        style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}
                    >
                        <a
                            href="/dashboarddoctor"
                            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                        >
                            
                            <img src={logo} alt="Logo de Mi Sitio" style={{ height: '100px', width: '100%' }} />
                        </a>
                        <hr />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <Link to="/dashboarddoctor" className="nav-link active text-white">
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
                                <Link to="/paneldoctor" className="nav-link text-white">
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
                        {/* Header con hora dinámica */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Hello, {doctorName}</h2>
                                <p className="text-muted">Here's a summary of your activity this week.</p>
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

                        {/* Tarjetas de métricas/acciones */}
                        <div className="row g-4">
                            <div className="col-md-3">
                                <div
                                    className="card"
                                    style={{ backgroundColor: "#f8f9fa", border: "none" }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-calendar-check fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>Citas Próximas</h5>
                                        </div>
                                        <h3 className="card-text" style={{ color: "#000" }}>
                                            {store.doctorPanelData?.doctor?.appointments?.length || 0}
                                        </h3>
                                        <Link
                                            to="/doctor-appointment"
                                            className="text-decoration-none"
                                            style={{ color: "#97dbe7" }}
                                        >
                                            Ver detalles <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div
                                    className="card"
                                    style={{ backgroundColor: "#f8f9fa", border: "none" }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-book fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>Especialidades</h5>
                                        </div>
                                        <h3 className="card-text" style={{ color: "#000" }}>
                                            {store.doctorPanelData?.doctor?.specialties?.length || 0}
                                        </h3>
                                        <Link
                                            to="/doctor_edit_specialty"
                                            className="text-decoration-none"
                                            style={{ color: "#97dbe7" }}
                                        >
                                            Gestionar <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div
                                    className="card"
                                    style={{ backgroundColor: "#f8f9fa", border: "none" }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-building fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>Oficinas</h5>
                                        </div>
                                        <h3 className="card-text" style={{ color: "#000" }}>
                                            {store.doctorPanelData?.doctor?.medical_centers?.length || 0}
                                        </h3>
                                        <Link
                                            to="/center_office_by_doctor"
                                            className="text-decoration-none"
                                            style={{ color: "#97dbe7" }}
                                        >
                                            Gestionar <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div
                                    className="card"
                                    style={{ backgroundColor: "#f8f9fa", border: "none" }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="bi bi-person fs-3 me-3" style={{ color: "#97dbe7" }}></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>Mi Perfil</h5>
                                        </div>
                                        <h3 className="card-text" style={{ color: "#000" }}>Editar</h3>
                                        <Link
                                            to="/paneldoctor"
                                            className="text-decoration-none"
                                            style={{ color: "#97dbe7" }}
                                        >
                                            Ir al perfil <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}
        </>
    );
};