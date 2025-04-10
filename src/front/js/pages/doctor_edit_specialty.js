import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";

export const DoctorEditSpecialty = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [availableSpecialties, setAvailableSpecialties] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
            actions.getSpecialties();
            actions.getDoctorSpecialties();
            actions.getDoctorPanel();
        }
    }, [store.authDoctor, actions, navigate]);

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
                        <Link to="/doctor-appointment" className="nav-link text-white">
                            <i className="bi bi-calendar-check me-2"></i>
                            Ver Mis Citas
                        </Link>
                    </li>
                    <li>
                        <Link to="/doctor_edit_specialty" className="nav-link active text-white">
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
                            <p className="text-muted">Gestiona tus especialidades aquí.</p>
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
                                    }}
                                />
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
                                                    minWidth: "100px", // Ancho mínimo para el botón
                                                    whiteSpace: "nowrap", // Evita que el texto se corte
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