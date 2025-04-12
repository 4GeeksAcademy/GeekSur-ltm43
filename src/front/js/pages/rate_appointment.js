import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, Link } from "react-router-dom";

export const RateAppointment = () => {
    const { store, actions } = useContext(Context);
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [reviewData, setReviewData] = useState({
        id_doctor: "",
        id_center: "",
        rating: 0,
        comments: "",
        date: "",
    });
    const [ratingStars, setRatingStars] = useState([false, false, false, false, false]);

    useEffect(() => {
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        } else {
            // Prellenar algunos campos basados en la cita
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
    }, [store.authPatient, appointmentId, store.patientAppointments]);

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
            navigate("/miscitas");
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
        }
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

    return (
        <div className="container">
            <h1>Calificar Cita</h1>
            {store.reviewError && <p style={{ color: "red" }}>{store.reviewError}</p>}
            {store.reviewSuccessMessage && <p style={{ color: "green" }}>{store.reviewSuccessMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Doctor ID:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="id_doctor"
                        value={reviewData.id_doctor}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Centro ID:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="id_center"
                        value={reviewData.id_center}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={reviewData.date}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Calificación:</label>
                    <div>{renderStars()}</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Comentarios:</label>
                    <textarea
                        className="form-control"
                        name="comments"
                        value={reviewData.comments}
                        onChange={handleInputChange}
                        rows="3"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Enviar Reseña</button>
            </form>
            <br />
            <Link to="/patient-appointments">
                <button className="btn btn-primary">Volver a Mis Citas</button>
            </Link>
        </div>
    );
};