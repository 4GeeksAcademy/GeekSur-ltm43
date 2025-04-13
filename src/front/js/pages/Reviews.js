import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';
import "../../styles/home.css"; // Reutilizamos los estilos de MedicalCenters

const Reviews = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getReviews();
        // Cargar datos de doctores, pacientes y centros médicos
        actions.getDoctors();
        actions.getPatients();
        actions.getMedicalCenters();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{ fontSize: '1.2em', color: '#ffc107', marginRight: '3px' }}
                >
                    {i < rating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    // Funciones para mapear IDs a nombres
    const getDoctorName = (doctorId) => {
        const doctor = store.doctors.find(d => d.id === doctorId);
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : `Doctor ${doctorId}`;
    };

    const getPatientName = (patientId) => {
        const patient = store.patients.find(p => p.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : `Paciente ${patientId}`;
    };

    const getCenterName = (centerId) => {
        const center = store.medicalCenters.find(c => c.id === centerId);
        return center ? center.name : `Centro ${centerId}`;
    };

    return (
        <div className="container">
            {/* Sección de Reseñas */}
            <section className="doctors-section" style={{ padding: '40px 20px' }}>
                <h2 style={{ color: '#1ca9bb', textAlign: 'center', marginBottom: '30px' }}>
                    Nuestras Reseñas
                </h2>
                {store.reviewError && <div className="alert alert-danger" role="alert">{store.reviewError}</div>}
                {store.reviewSuccessMessage && <div className="alert alert-success" role="alert">{store.reviewSuccessMessage}</div>}
                {store.reviews?.length > 0 ? (
                    <div className="doctors-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                        {store.reviews.map((review) => (
                            <div
                                key={review.id}
                                className="doctor-card"
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    width: '300px',
                                    padding: '15px',
                                    textAlign: 'center'
                                }}
                            >
                                {/* Detalles de la Reseña */}
                                <div className="doctor-details">
                                    <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#1ca9bb' }}>
                                        Reseña #{review.id}
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Fecha:</strong> {review.date}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Calificación:</strong> {renderStars(review.rating)} ({review.rating}/5)
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Comentarios:</strong> {review.comments || 'Sin comentarios'}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Doctor:</strong> {getDoctorName(review.id_doctor)}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Paciente:</strong> {getPatientName(review.id_patient)}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                                        <strong>Centro Médico:</strong> {getCenterName(review.id_center)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        {store.reviewError ? "Error al cargar los datos." : "No se encontraron reseñas."}
                    </p>
                )}
            </section>

            {/* Botón para volver al Home */}
            <section style={{ textAlign: 'center', padding: '20px' }}>
                <Link to="/">
                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#1ca9bb',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none'
                        }}
                    >
                        Volver al Inicio
                    </button>
                </Link>
            </section>
        </div>
    );
};

export default Reviews;