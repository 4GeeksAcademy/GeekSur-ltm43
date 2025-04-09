import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import logo from "../../img/logo.png";

export const DoctorEdit = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
    });
    const [photo, setPhoto] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    // Actualizar la hora cada minuto
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
        } else {
            setFormData({
                first_name: store.doctorPanelData.doctor.first_name,
                last_name: store.doctorPanelData.doctor.last_name,
                email: store.doctorPanelData.doctor.email,
                phone_number: store.doctorPanelData.doctor.phone_number,
                password: "",
            });
            setPhoto(null);
            setRemovePhoto(false);
        }
    }, [store.authDoctor, store.doctorPanelData, actions, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

        try {
            const data = new FormData();
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("email", formData.email);
            data.append("phone_number", formData.phone_number);
            if (formData.password) {
                data.append("password", formData.password);
            }
            if (photo) {
                data.append("photo", photo);
            }
            data.append("remove_photo", removePhoto);

            await actions.updateDoctor(data);
            setSuccessMessage("Datos actualizados correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
            setEditMode(false);
            await actions.getDoctorPanel();
        } catch (error) {
            setError(error.message || "Error al actualizar los datos");
            setTimeout(() => setError(null), 3000);
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
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
                <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#b7f4ff" }}>
                    {/* Sidebar */}
                    <div
                        className="d-flex flex-column flex-shrink-0 p-3 text-white shadow-sm"
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
                                <Link
                                    to="/dashboarddoctor"
                                    className="nav-link text-white d-flex align-items-center py-3"
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="bi bi-house-door me-3" style={{ fontSize: "1.2rem" }}></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/doctor-appointment"
                                    className="nav-link text-white d-flex align-items-center py-3"
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="bi bi-calendar-check me-3" style={{ fontSize: "1.2rem" }}></i>
                                    Ver Mis Citas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/doctor_edit_specialty"
                                    className="nav-link text-white d-flex align-items-center py-3"
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="bi bi-book me-3" style={{ fontSize: "1.2rem" }}></i>
                                    Mis Especialidades
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/center_office_by_doctor"
                                    className="nav-link text-white d-flex align-items-center py-3"
                                    style={{ borderRadius: "8px" }}
                                >
                                    <i className="bi bi-building me-3" style={{ fontSize: "1.2rem" }}></i>
                                    Mis Oficinas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/paneldoctor"
                                    className="nav-link active text-white d-flex align-items-center py-3"
                                    style={{ borderRadius: "8px", backgroundColor: "#97dbe7", color: "#000" }}
                                >
                                    <i className="bi bi-person me-3" style={{ fontSize: "1.2rem" }}></i>
                                    Mi Perfil
                                </Link>
                            </li>
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn btn-light text-dark d-flex align-items-center py-2"
                            style={{ backgroundColor: "#97dbe7", border: "none", borderRadius: "8px" }}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-grow-1">
                        {/* Header */}
                        <header
                            className="d-flex justify-content-between align-items-center p-4 shadow-sm"
                            style={{ backgroundColor: "#fff", borderBottom: "1px solid #e9ecef" }}
                        >
                            <div>
                                <h2 className="mb-0" style={{ color: "#000" }}>
                                    Editar Perfil
                                </h2>
                                <p className="text-muted mb-0">Actualiza tu información personal aquí.</p>
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
                        </header>

                        {/* Contenido */}
                        <div className="p-4" style={{ backgroundColor: "#b7f4ff", minHeight: "calc(100vh - 80px)" }}>
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

                            {store.doctorPanelData ? (
                                <div className="row g-4">
                                    {/* Formulario de edición */}
                                    <div className="col-md-6">
                                        <div
                                            className="card shadow-sm"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                border: "none",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <div className="card-body">
                                                {editMode ? (
                                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Nombre:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="first_name"
                                                                value={formData.first_name}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                                required
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Apellido:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="last_name"
                                                                value={formData.last_name}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                                required
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Email:
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                                required
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Teléfono:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="phone_number"
                                                                value={formData.phone_number}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                                required
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Contraseña (opcional):
                                                            </label>
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                value={formData.password}
                                                                onChange={handleInputChange}
                                                                className="form-control"
                                                                placeholder="Dejar en blanco para no cambiar"
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label" style={{ color: "#000" }}>
                                                                Foto de perfil:
                                                            </label>
                                                            {store.doctorPanelData.doctor.url && !removePhoto && (
                                                                <div className="mb-2">
                                                                    <img
                                                                        src={store.doctorPanelData.doctor.url}
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
                                                                            backgroundColor: "rgb(173 29 29)",
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
                                                                style={{ borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="submit"
                                                                className="btn"
                                                                style={{
                                                                    backgroundColor: "#97dbe7",
                                                                    color: "#000",
                                                                    borderRadius: "8px",
                                                                }}
                                                            >
                                                                Guardar Cambios
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditMode(false)}
                                                                className="btn"
                                                                style={{
                                                                    backgroundColor: "#e9ecef",
                                                                    color: "#000",
                                                                    borderRadius: "8px",
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div>
                                                        {store.doctorPanelData.doctor.url && (
                                                            <div className="text-center mb-3">
                                                                <img
                                                                    src={store.doctorPanelData.doctor.url}
                                                                    alt="Foto de perfil"
                                                                    style={{
                                                                        width: "150px",
                                                                        height: "150px",
                                                                        borderRadius: "50%",
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <h6 style={{ color: "#000" }}>{doctorName}</h6>
                                                        <p className="card-text" style={{ color: "#000" }}>
                                                            <strong>Email:</strong>{" "}
                                                            {store.doctorPanelData.doctor.email}
                                                            <br />
                                                            <strong>Teléfono:</strong>{" "}
                                                            {store.doctorPanelData.doctor.phone_number}
                                                        </p>
                                                        <button
                                                            onClick={() => setEditMode(true)}
                                                            className="btn"
                                                            style={{
                                                                backgroundColor: "#97dbe7",
                                                                color: "#000",
                                                                borderRadius: "8px",
                                                            }}
                                                        >
                                                            Editar Datos
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección de resumen */}
                                    <div className="col-md-6">
                                        <div
                                            className="card shadow-sm"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                border: "none",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <div className="card-body">
                                                <h5 className="card-title" style={{ color: "#000" }}>
                                                    Resumen del Perfil
                                                </h5>
                                                <p className="card-text" style={{ color: "#000" }}>
                                                    <strong>Nombre:</strong> {doctorName}
                                                    <br />
                                                    <strong>Ubicación:</strong> {location}
                                                    <br />
                                                    <strong>Especialidades:</strong>{" "}
                                                    {store.doctorPanelData?.specialties?.length > 0
                                                        ? store.doctorPanelData.specialties.join(", ")
                                                        : "No especificadas"}
                                                    <br />
                                                    <strong>Oficinas:</strong>{" "}
                                                    {store.doctorPanelData?.offices?.length > 0
                                                        ? store.doctorPanelData.offices.join(", ")
                                                        : "No especificadas"}
                                                </p>
                                                <div className="mt-3">
                                                    <p style={{ color: "#000", fontStyle: "italic" }}>
                                                        "Tu perfil es tu carta de presentación. ¡Asegúrate de
                                                        mantenerlo actualizado!"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Cargando datos...</p>
                            )}

                            {/* Botón "Volver al Panel" */}
                            <div className="mt-4">
                                <Link to="/paneldoctor">
                                    <button
                                        className="btn"
                                        style={{
                                            backgroundColor: "#97dbe7",
                                            color: "#000",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        Volver al Panel
                                    </button>
                                </Link>
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