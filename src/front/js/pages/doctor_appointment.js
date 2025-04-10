import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";

export const DoctorAppointment = () => {
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
        } else {
            console.log("Cargando citas para el doctor con token:", localStorage.getItem("tokendoctor"));
            actions.getDoctorAppointments();
        }
    }, [store.authDoctor, actions, navigate]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const handleManageAppointment = (appointmentId, action) => {
        actions.manageDoctorAppointment(appointmentId, action);
    };

    const doctor = store.doctorPanelData?.doctor;
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor";
    const location = doctor?.city ? `${doctor.city}, ${doctor.country || 'CA'}` : "San Francisco, CA";

    return (
        <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
            {/* Sidebar */}
            <div
                className="d-flex flex-column flex-shrink-0 p-3 text-white shadow-sm"
                style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}
            >
                <Link
                    to="/dashboarddoctor"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                    <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
                </Link>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/dashboarddoctor" className="nav-link text-white">
                            <i className="bi bi-house-door me-2"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/doctor-appointment" className="nav-link active text-white">
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
            <div className="flex-grow-1 p-4">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold">Hello, {doctorName}</h2>
                            <p className="text-muted">Aquí están tus citas programadas.</p>
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
                                    className="rounded-circle border"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        border: "2px solid #97dbe7",
                                        cursor: "pointer", // Indicar que es clickeable
                                    }}
                                />
                            )}
                        </div>
                        
                    </div>

                    {store.doctorAppointments && store.doctorAppointments.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {store.doctorAppointments.map((appointment) => (
                                <div key={appointment.id} className="col">
                                    <div className="card shadow-sm h-100" style={{ border: "none" }}>
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold" style={{ color: "#000" }}>
                                                Cita #{appointment.id}
                                            </h5>
                                            <p className="card-text" style={{ color: "#000" }}>
                                                <strong>Fecha:</strong> {appointment.date}<br />
                                                <strong>Hora:</strong> {appointment.hour}<br />
                                                <strong>Paciente ID:</strong> {appointment.id_patient}<br />
                                                <strong>Centro ID:</strong> {appointment.id_center}<br />
                                                <strong>Especialidad ID:</strong> {appointment.id_specialty}<br />
                                                <strong>Estado:</strong> {appointment.confirmation}
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleManageAppointment(appointment.id, "cancel")}
                                                    className="btn btn-danger"
                                                    style={{ backgroundColor: "rgb(173 29 29)" }}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={() => handleManageAppointment(appointment.id, "complete")}
                                                    className="btn btn-primary"
                                                    style={{ backgroundColor: "rgb(93 177 212)" }}
                                                >
                                                    Marcar como Hecha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info" role="alert">
                            No tienes citas programadas.
                        </div>
                    )}

                    {/* Botón "Back Home" */}
                    <div className="mt-4">
                        <Link to="/">
                            <button className="btn btn-light text-dark" style={{ backgroundColor: "#97dbe7" }}>
                                Back Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};