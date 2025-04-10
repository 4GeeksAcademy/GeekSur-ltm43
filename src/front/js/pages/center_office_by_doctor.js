import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Añadimos useLocation
import logo from "../../img/logo.png";

export const CenterOfficeByDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ruta actual
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [office, setOffice] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        } else {
            actions.getMedicalCenterDoctor();
            actions.getMedicalCenters();
            actions.getDoctorPanel();
        }
    }, [store.authDoctor, actions, navigate]);

    const handleAddCenter = async (e) => {
        e.preventDefault();
        if (!selectedCenter || !office) {
            setError("Por favor, selecciona un centro médico y agrega la oficina.");
            return;
        }
        const result = await actions.addMedicalCenterDoctor(selectedCenter, office);
        if (!result.success) {
            setError(result.msg);
            setTimeout(() => setError(""), 3000);
            return;
        }
        setSelectedCenter(null);
        setOffice("");
        setError("");
        setSuccess("Centro médico y oficina agregados correctamente");
        actions.getDoctorPanel();
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleDeleteCenter = async (centerId) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar este centro?");
        if (!confirmDelete) return;
        const result = await actions.deleteMedicalCenterDoctor(centerId);
        if (result) {
            setSuccess("Centro eliminado correctamente.");
            actions.getDoctorPanel();
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError("Error al eliminar el centro.");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const doctor = store.doctorPanelData?.doctor;
    const doctorName = doctor ? `${doctor.first_name} ${doctor.last_name}` : "Doctor";
    const doctorLocation = doctor?.city ? `${doctor.city}, ${doctor.country || 'CA'}` : "San Francisco, CA"; // Renombramos a doctorLocation

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
                        <h2>Hello, {doctorName}</h2>
                        <p className="text-muted">Gestiona tus centros médicos y oficinas aquí.</p>
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

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}

                <div className="card mb-4" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                    <div className="card-body">
                        <h5 className="card-title" style={{ color: "#000" }}>Agregar Nueva Oficina</h5>
                        <form onSubmit={handleAddCenter}>
                            <div className="form-group mb-3">
                                <label htmlFor="centerSelector" className="form-label">Selecciona un Centro Médico</label>
                                <select
                                    id="centerSelector"
                                    className="form-control"
                                    value={selectedCenter || ""}
                                    onChange={(e) => setSelectedCenter(e.target.value)}
                                >
                                    <option value="">Seleccione un centro</option>
                                    {store.medicalCenters &&
                                        store.medicalCenters.map((center) => (
                                            <option key={center.id} value={center.id}>
                                                {center.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="office" className="form-label">Número de Oficina</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="office"
                                    value={office}
                                    onChange={(e) => setOffice(e.target.value)}
                                    placeholder="Ingrese el número de oficina"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                style={{ backgroundColor: "#97dbe7", color: "#000" }}
                            >
                                Agregar Oficina
                            </button>
                        </form>
                    </div>
                </div>

                <h3 className="mb-3">Centros Médicos Asignados</h3>
                {store.doctorPanelData?.doctor?.medical_centers && store.doctorPanelData.doctor.medical_centers.length > 0 ? (
                    <div className="row g-4">
                        {store.doctorPanelData.doctor.medical_centers
                            .sort((a, b) => {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                if (a.office < b.office) return -1;
                                if (a.office > b.office) return 1;
                                return 0;
                            })
                            .map((center) => (
                                <div key={center.id} className="col-md-4">
                                    <div className="card" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="card-title mb-0" style={{ color: "#000" }}>{center.name}</h5>
                                                <p className="card-text" style={{ color: "#000" }}>Oficina: {center.office}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteCenter(center.id)}
                                                className="btn btn-danger"
                                                style={{
                                                    backgroundColor: "rgb(173 29 39)",
                                                    minWidth: "100px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p>No tienes centros médicos asignados.</p>
                )}

                <div className="mt-4">
                    <Link to="/center_office_by_doctor_edit">
                        <button className="btn" style={{ backgroundColor: "#97dbe7", color: "#000" }}>
                            Modificar Oficina
                        </button>
                    </Link>
                </div>
            </div>
        </div>
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