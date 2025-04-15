import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/meedgeeknegro.png";

export const PatientEdit = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        birth_date: "",
        phone_number: "",
        historial_clinico: "",
        password: "",
    });

    const [photo, setPhoto] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
        } else if (!store.currentPatient) {
            actions.getUserPatient();
        }
    }, []);

    useEffect(() => {
        if (store.currentPatient) {
            setFormData({
                email: store.currentPatient.email || "",
                first_name: store.currentPatient.first_name || "",
                last_name: store.currentPatient.last_name || "",
                phone_number: store.currentPatient.phone_number || "",
                birth_date: store.currentPatient.birth_date || "",
                password: "",
                historial_clinico: store.currentPatient.historial_clinico || "",
            });
            setPhoto(null);
            setRemovePhoto(false);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
        setRemovePhoto(false);
        
    };

    const handleRemovePhoto = () => {
        setRemovePhoto(true);
        setPhoto(null);
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedFormData = new FormData();
            for (let key in formData) {
                if (formData[key]) {
                    updatedFormData.append(key, formData[key]);
                }
            }
            if (photo) {
                updatedFormData.append("photo", photo);
            }
            updatedFormData.append("remove_photo", removePhoto.toString());

            
            for (let [key, value] of updatedFormData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await actions.updatePatient(updatedFormData);
            

            // Refrescar datos del paciente
            await actions.getUserPatient();
            

            setSuccessMessage("Datos actualizados correctamente");
            setTimeout(() => {
                setSuccessMessage(null);
                navigate("/panelpatient");
            }, 2000);
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            setError(error.message || "Error al actualizar los datos");
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const patient = store.currentPatient;
    const patientName = patient?.first_name && patient?.last_name
        ? `${patient.first_name} ${patient.last_name}`
        : "Paciente";

    const patientLocation = patient?.city ? `${patient.city}, ${patient.country || "CA"}` : "San Francisco, CA";

    return (
        <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
            {/* Sidebar fijo - Igual al del PanelPatient */}
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
                                location.pathname === "/panelpatient" || location.pathname === "/patient_edit" ? "active" : ""
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
                    <li>
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
                            <i className="bi bi-robot me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Habla Con Boti IA
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
                        padding: "10px",
                        borderRadius: "5px",
                        fontWeight: "500",
                        width: "fit-content",
                        maxWidth: "100%",
                        margin: "0 auto",
                    }}
                >
                    <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                    Cerrar Sesión
                </button>
            </div>

            {/* Contenido principal - Formulario de edición */}
            <div className="flex-grow-1 p-4" style={{ marginLeft: "280px", backgroundColor: "#f0faff" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2>Editar Perfil</h2>
                        <p className="text-muted">Actualiza tu información personal</p>
                    </div>
                    <div className="d-flex align-items-center position-relative">
                        <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                            <i className="bi bi-geo-alt me-1"></i>
                            {patientLocation} - {currentTime}
                        </span>
                        {patient?.url && !removePhoto ? (
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
                        ) : (
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: "#97dbe7",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {patientName.charAt(0).toUpperCase()}
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

                <div className="card shadow-sm p-4" style={{ backgroundColor: "#fff", borderRadius: "10px" }}>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña (dejar en blanco para no cambiar)</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Historial Clínico</label>
                            <textarea
                                className="form-control"
                                name="historial_clinico"
                                value={formData.historial_clinico}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Información relevante sobre tu salud"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Foto de perfil</label>
                            {patient?.url && !removePhoto && (
                                <div className="mb-2">
                                    <img
                                        src={patient.url}
                                        alt="Foto actual"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemovePhoto}
                                        className="btn btn-sm ms-2"
                                        style={{
                                            backgroundColor: "rgb(173, 29, 29)",
                                            color: "white",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        Eliminar Foto
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="form-control"
                                accept="image/*"
                                disabled={removePhoto}
                            />
                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                onClick={() => navigate("/panelpatient")}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};