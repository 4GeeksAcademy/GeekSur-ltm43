// import React, { useEffect, useContext } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, Navigate, Link } from "react-router-dom";

// export const PatientAppointments = () => {
//     const { store, actions } = useContext(Context);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
//             navigate("/loginpatient");
//         } else {
//             actions.getPatientAppointments();
//         }
//     }, [store.authPatient]);

//     const handleRate = (appointmentId) => {
//         navigate(`/rate-appointment/${appointmentId}`);
//     };

//     const handleLogout = () => {
//         actions.logoutPatient();
//         navigate("/loginpatient");
//     };

//     return (
//         <>
//             {store.authPatient || localStorage.getItem("tokenpatient") ? (
//                 <div className="container">
//                     <h1>Mis Citas</h1>
//                     <button onClick={handleLogout}>Cerrar Sesión</button>

//                     {store.patientAppointmentError && (
//                         <p style={{ color: "red" }}>{store.patientAppointmentError}</p>
//                     )}
//                     {store.patientAppointments.length > 0 ? (
//                         <ul>
//                             {store.patientAppointments.map((appointment) => (
//                                 <li key={appointment.id}>
//                                     Fecha: {appointment.date} | Hora: {appointment.hour} | 
//                                     Doctor ID: {appointment.id_doctor} | 
//                                     Centro ID: {appointment.id_center} | 
//                                     Especialidad ID: {appointment.id_specialty} | 
//                                     Estado: {appointment.confirmation}
//                                     <button
//                                         className="btn btn-primary ms-2"
//                                         onClick={() => handleRate(appointment.id)}
//                                     >
//                                         Calificar
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p>No tienes citas registradas.</p>
//                     )}
//                     <br />
//                     <Link to="/dashboardpatient">
//                         <button className="btn btn-primary">Volver al Dashboard</button>
//                     </Link>
//                     <Link to="/">
//                         <button className="btn btn-primary ms-2">Back Home</button>
//                     </Link>
//                 </div>
//             ) : (
//                 <Navigate to="/loginpatient" />
//             )}
//         </>
//     );
// };
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import logo from "../../img/logo.png";

export const PatientAppointments = () => {
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
        } else {
            actions.getPatientAppointments();
        }
    }, [store.authPatient]);

    const handleRate = (appointmentId) => {
        navigate(`/rate-appointment/${appointmentId}`);
    };

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
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
                                <h2>Mis Citas</h2>
                                <p className="text-muted">Aquí puedes ver y gestionar todas tus citas.</p>
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

                        {store.patientAppointmentError && (
                            <div className="alert alert-danger">{store.patientAppointmentError}</div>
                        )}

                        {store.patientAppointments.length > 0 ? (
                            <div className="card shadow-sm" style={{ 
                                backgroundColor: "#f8f9fa", 
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                                padding: "20px"
                            }}>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Hora</th>
                                                <th>Doctor</th>
                                                <th>Centro Médico</th>
                                                <th>Especialidad</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.patientAppointments.map((appointment) => (
                                                <tr key={appointment.id}>
                                                    <td>{appointment.date}</td>
                                                    <td>{appointment.hour}</td>
                                                    <td>Dr. {appointment.doctor_name || `ID: ${appointment.id_doctor}`}</td>
                                                    <td>{appointment.center_name || `ID: ${appointment.id_center}`}</td>
                                                    <td>{appointment.specialty_name || `ID: ${appointment.id_specialty}`}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            appointment.confirmation === "confirmed" ? "bg-success" :
                                                            appointment.confirmation === "pending" ? "bg-warning" :
                                                            // appointment.confirmation === "cancelled" ? "bg-danger" : "bg-secondary"
                                                            appointment.confirmation === "false" ? "bg-danger" : "bg-secondary"
                                                                                                                       
                                                        }`}>
                                                             {appointment.confirmation === "false" ? "Pendiente" : appointment.confirmation}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleRate(appointment.id)}
                                                            style={{
                                                                backgroundColor: "#97dbe7",
                                                                color: "#000",
                                                                minWidth: "100px",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            Calificar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm" style={{ 
                                backgroundColor: "#f8f9fa", 
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                                padding: "20px"
                            }}>
                                <p className="text-center">No tienes citas registradas.</p>
                            </div>
                        )}

                        <div className="mt-4">

                        </div>
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