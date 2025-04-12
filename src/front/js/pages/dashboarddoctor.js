import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    // Estado para la hora actual
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    // Estado para el dropdown de la foto de perfil
    const [showDropdown, setShowDropdown] = useState(false);

    // Estado para manejar la carga de datos
    const [isLoading, setIsLoading] = useState(true);

    // Actualizar la hora cada minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Cargar datos del doctor, centros médicos y citas
    useEffect(() => {
        const loadData = async () => {
            console.log("Iniciando carga de datos...");
            setIsLoading(true);

            try {
                if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
                    console.log("No hay autenticación, redirigiendo a login...");
                    navigate("/logindoctor");
                    return;
                }

                console.log("Autenticación confirmada, cargando datos...");

                // Ejecutar todas las acciones
                const promises = [
                    actions.getDoctorPanel().then(() => console.log("getDoctorPanel completado")),
                    actions.getMedicalCenterDoctor().then(() => console.log("getMedicalCenterDoctor completado")),
                    actions.getDoctorAppointments().then(() => console.log("getDoctorAppointments completado")),
                ];

                await Promise.all(promises);
                console.log("Todas las acciones completadas:", {
                    doctorPanelData: store.doctorPanelData,
                    medicalCenterDoctor: store.medical_center_doctor,
                    doctorAppointments: store.doctorAppointments,
                    doctorAppointmentsChartData: store.doctorAppointmentsChartData,
                });
            } catch (error) {
                console.error("Error durante la carga de datos:", error);
            } finally {
                console.log("Finalizando carga, actualizando isLoading a false...");
                setIsLoading(false);
                console.log("isLoading después de actualizar:", isLoading);
            }
        };

        loadData();
    }, []); // Dependencias vacías para ejecutar solo al montar

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
    const doctorLocation = `${city}, ${country}`;

    // Datos para el gráfico de citas por día
    const chartData = {
        labels: store.doctorAppointmentsChartData?.labels || ["Sin datos"],
        datasets: [
            {
                label: "Citas",
                data: store.doctorAppointmentsChartData?.values || [0],
                backgroundColor: "#97dbe7",
                borderColor: "#97dbe7",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: { color: "#000" },
            },
            title: {
                display: true,
                text: "Citas por Día",
                color: "#000",
            },
        },
        scales: {
            x: {
                ticks: { color: "#000" },
                title: {
                    display: true,
                    text: "Fecha",
                    color: "#000",
                },
            },
            y: {
                ticks: { 
                    color: "#000",
                    stepSize: 1,
                },
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Número de Citas",
                    color: "#000",
                },
            },
        },
    };

    // Datos de actividad reciente (simulados)
    const recentActivity = [
        { action: "Agendaste una cita con un paciente", time: "1 hr ago" },
        { action: "Añadiste una nueva especialidad", time: "3 hrs ago" },
        { action: "Actualizaste tu perfil", time: "1 day ago" },
    ];

    // Datos de metas (simulados)
    const goals = [
        { title: "Atender 10 citas esta semana", progress: 70, dueDate: "Apr 15" },
        { title: "Agregar una nueva especialidad", progress: 30, dueDate: "Apr 20" },
        { title: "Actualizar horarios de oficina", progress: 50, dueDate: "Apr 25" },
    ];

    console.log("Renderizando componente, isLoading:", isLoading);

    // if (isLoading) {
    //     return (
    //         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    //             <p>Cargando datos...</p>
    //         </div>
    //     );
    // }

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
                            <img src={logo} alt="Logo de Mi Sitio" style={{ height: "100px", width: "100%" }} />
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
                                <h2>Hello, {doctorName}</h2>
                                <p className="text-muted">Here's a summary of your activity this week.</p>
                            </div>
                            <div className="d-flex align-items-center position-relative">
                                <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {doctorLocation} - {currentTime}
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

                        {/* Tarjetas de métricas/acciones */}
                        <div className="row g-4 mb-4">
                            <div className="col-md-3">
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
                                                Citas Próximas
                                            </h5>
                                        </div>
                                        <h3 className="card-text" style={{ color: "#000" }}>
                                            {
                                                store.doctorAppointments?.filter(appointment => {
                                                    const [year, month, day] = appointment.date.split("-").map(Number);
                                                    const appointmentDate = new Date(year, month - 1, day);
                                                    const currentDate = new Date("2025-04-12");
                                                    return (
                                                        appointmentDate >= currentDate &&
                                                        appointment.confirmation !== "cancelled" &&
                                                        appointment.confirmation !== "completed"
                                                    );
                                                }).length || 0
                                            }
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
                                                className="bi bi-book fs-3 me-3"
                                                style={{ color: "#97dbe7" }}
                                            ></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>
                                                Especialidades
                                            </h5>
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
                                                className="bi bi-building fs-3 me-3"
                                                style={{ color: "#97dbe7" }}
                                            ></i>
                                            <h5 className="card-title mb-0" style={{ color: "#000" }}>
                                                Oficinas
                                            </h5>
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

                        {/* Gráfico de citas por día */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div
                                    className="card shadow-sm"
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #dee2e6",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <div className="card-body">
                                        <Bar data={chartData} options={chartOptions} />
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

// Añadir estilos personalizados para el resaltado
const styles = `
    .nav-link.active {
        backgroundColor: #f0faff !important;
        color: #000 !important;
    }
`;

// Inyectar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);