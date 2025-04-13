import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import logo from "../../img/logo.png";

export const RateAppointment = () => {
    const { store, actions } = useContext(Context);
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [reviewData, setReviewData] = useState({
        id_doctor: "",
        id_center: "",
        rating: 0,
        comments: "",
        date: "",
    });
    const [ratingStars, setRatingStars] = useState([false, false, false, false, false]);
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
            const appointment = store.patientAppointments.find(app => app.id === parseInt(appointmentId));
            if (appointment) {
                setReviewData({
                    ...reviewData,
                    id_doctor: appointment.id_doctor,
                    id_center: appointment.id_center,
                    date: appointment.date,
                });
            }
        }
    }, []);

    const handleInputChange = (e) => {
        setReviewData({ ...reviewData, [e.target.name]: e.target.value });
    };

    const handleRatingClick = (index) => {
        const newRatingStars = ratingStars.map((_, i) => i < index + 1);
        setRatingStars(newRatingStars);
        setReviewData({ ...reviewData, rating: index + 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.createPatientReview(reviewData);
            navigate("/patient-appointments");
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
        }
    };

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const renderStars = () => {
        return ratingStars.map((filled, index) => (
            <span
                key={index}
                style={{ cursor: "pointer", fontSize: "1.5em", color: "#ffc107", marginRight: "5px" }}
                onClick={() => handleRatingClick(index)}
            >
                {filled ? "★" : "☆"}
            </span>
        ));
    };

    const patient = store.currentPatient;
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
                        style={{
                            backgroundColor: "#f0faff",
                            color: "#000",
                            marginLeft: "280px",
                        }}
                    >
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Calificar Cita</h2>
                                <p className="text-muted">Comparte tu experiencia sobre la atención recibida</p>
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

                        <div className="card shadow-sm" style={{ 
                            backgroundColor: "#f8f9fa", 
                            border: "1px solid #dee2e6",
                            borderRadius: "10px",
                            padding: "30px"
                        }}>
                            {store.reviewError && (
                                <div className="alert alert-danger mb-3">
                                    {store.reviewError}
                                </div>
                            )}
                            {store.reviewSuccessMessage && (
                                <div className="alert alert-success mb-3">
                                    {store.reviewSuccessMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label">Doctor ID:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="id_doctor"
                                            value={reviewData.id_doctor}
                                            onChange={handleInputChange}
                                            disabled
                                            style={{ border: "1px solid #000" }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Centro ID:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="id_center"
                                            value={reviewData.id_center}
                                            onChange={handleInputChange}
                                            disabled
                                            style={{ border: "1px solid #000" }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Fecha:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={reviewData.date}
                                            onChange={handleInputChange}
                                            disabled
                                            style={{ border: "1px solid #000" }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Calificación:</label>
                                    <div className="d-flex align-items-center">
                                        {renderStars()}
                                        <span className="ms-2">{reviewData.rating}/5</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Comentarios:</label>
                                    <textarea
                                        className="form-control"
                                        name="comments"
                                        value={reviewData.comments}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                        style={{ border: "1px solid #000" }}
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn"
                                        style={{
                                            backgroundColor: "#97dbe7",
                                            color: "#000",
                                            minWidth: "100px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        Enviar Reseña
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <Navigate to="/loginpatient" />
            )}

            {/* Estilos CSS */}
            <style>{`
                .nav-link.active {
                    background-color: #f0faff !important;
                    color: #000 !important;
                }
            `}</style>
        </>
    );
};