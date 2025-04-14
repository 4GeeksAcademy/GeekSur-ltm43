import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Añadimos useLocation
import logo from "../../img/meedgeeknegro.png";

export const DoctorEditSpecialty = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ruta actual
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [availableSpecialties, setAvailableSpecialties] = useState([]);
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
            actions.getSpecialties();
            actions.getDoctorSpecialties();
            actions.getDoctorPanel();
        }
    }, []);

    useEffect(() => {
        const filteredSpecialties = store.specialties.filter(
            (specialty) => !store.doctorSpecialties.some((ds) => ds.id_specialty === specialty.id)
        );
        setAvailableSpecialties(filteredSpecialties);
        console.log("Especialidades disponibles:", filteredSpecialties);
    }, [store.specialties, store.doctorSpecialties]);

    const handleAddSpecialty = async () => {
        if (!selectedSpecialty) {
            setError("Por favor, selecciona una especialidad.");
            return;
        }
        try {
            const result = await actions.addSpecialtyToDoctor(selectedSpecialty);
            if (result) {
                setSuccess("Especialidad agregada correctamente");
                setSelectedSpecialty("");
                actions.getDoctorSpecialties();
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (error) {
            setError("Error al agregar la especialidad");
        }
    };

    const handleDeleteSpecialty = async (specialtyId) => {
        try {
            await actions.deleteDoctorSpecialty(specialtyId);
            setSuccess("Especialidad eliminada correctamente");
            actions.getDoctorSpecialties();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError("Error al eliminar la especialidad");
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
                <Link
                    to="/dashboarddoctor"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                >
                    <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
                </Link>
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
                    marginLeft: "280px",
                }}
            >
                <div className="container-fluid">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold">Hola, {doctorName}</h2>
                            <p className="text-muted">Gestiona tus especialidades aquí.</p>
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
                                        className="rounded-circle border"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            border: "2px solid #97dbe7", // Corregimos el color
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

                    <div className="card shadow-sm mb-4" style={{ border: "none" }}>
                        <div className="card-body">
                            <h5 className="card-title fw-bold" style={{ color: "#000" }}>
                                Agregar Nueva Especialidad
                            </h5>
                            <div className="mb-3">
                                <label htmlFor="specialtySelector" className="form-label">
                                    Selecciona una especialidad
                                </label>
                                <select
                                    id="specialtySelector"
                                    className="form-select"
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                >
                                    <option value="">Selecciona una especialidad</option>
                                    {availableSpecialties.map((specialty) => (
                                        <option key={specialty.id} value={specialty.id}>
                                            {specialty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAddSpecialty}
                                className="btn btn-primary"
                                style={{ backgroundColor: "#97dbe7", border: "none", color: "#000" }}
                                disabled={!selectedSpecialty}
                            >
                                Agregar Especialidad
                            </button>
                        </div>
                    </div>

                    <h3 className="mb-3 fw-bold">Especialidades Actuales</h3>
                    {store.doctorSpecialties && store.doctorSpecialties.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {store.doctorSpecialties.map((specialty) => (
                                <div key={specialty.id} className="col">
                                    <div className="card shadow-sm h-100" style={{ border: "none" }}>
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <h5 className="card-title mb-0 fw-bold" style={{ color: "#000" }}>
                                                {specialty.name}
                                            </h5>
                                            <button
                                                onClick={() => handleDeleteSpecialty(specialty.id)}
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
                        <div className="alert alert-info" role="alert">
                            No tienes especialidades asignadas.
                        </div>
                    )}
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