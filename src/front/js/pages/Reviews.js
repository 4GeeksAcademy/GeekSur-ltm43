import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { Link } from 'react-router-dom';

const Reviews = () => {
    const { store, actions } = useContext(Context);
    const [newReview, setNewReview] = useState({
        id_doctor: '',
        id_patient: '',
        date: '',
        id_center: '',
        rating: 0,
        comments: '',
    });
    const [ratingStars, setRatingStars] = useState([false, false, false, false, false]);
    const [showForm, setShowForm] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        actions.getReviews();
    }, []);

    const handleInputChange = (e) => {
        setNewReview({ ...newReview, [e.target.name]: e.target.value });
    };

    const handleRatingClick = (index) => {
        const newRatingStars = ratingStars.map((_, i) => i < index + 1);
        setRatingStars(newRatingStars);
        setNewReview({ ...newReview, rating: index + 1 });
        setSelectedRating(index + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReview) {
                await actions.updateReview(editingReview.id, newReview);
                setEditingReview(null);
            } else {
                await actions.createReview(newReview);
            }
            setNewReview({
                id_doctor: '',
                id_patient: '',
                date: '',
                id_center: '',
                rating: 0,
                comments: '',
            });
            setRatingStars([false, false, false, false, false]);
            setSelectedRating(0);
            setShowForm(false);
        } catch (error) {
            console.error("Error al enviar la reseña:", error);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{ cursor: 'pointer', fontSize: '1.5em', color: '#ffc107', marginRight: '5px' }}
                    onClick={() => handleRatingClick(i)}
                >
                    {ratingStars[i] ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
        setNewReview({
            id_doctor: review.id_doctor,
            id_patient: review.id_patient,
            date: review.date,
            id_center: review.id_center,
            rating: review.rating,
            comments: review.comments,
        });
        const stars = Array(5).fill(false);
        for (let i = 0; i < review.rating; i++) {
            stars[i] = true;
        }
        setRatingStars(stars);
        setSelectedRating(review.rating);
        setShowForm(true);
    };

    const handleDeleteClick = (reviewId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
            actions.deleteReview(reviewId);
        }
    };

    return (
        <div className="container">
            <h1>Reviews</h1>
            {store.reviewError && <p className="error">{store.reviewError}</p>}
            {store.reviewSuccessMessage && <p className="success">{store.reviewSuccessMessage}</p>}

            <button className="btn btn-success mb-3" onClick={() => {
                setShowForm(!showForm);
                setEditingReview(null);
                setNewReview({ id_doctor: '', id_patient: '', date: '', id_center: '', rating: 0, comments: '' });
                setRatingStars([false, false, false, false, false]);
                setSelectedRating(0);
            }}>
                {showForm ? 'Cancelar Nuevo Review' : (editingReview ? 'Cancelar Edición' : 'Crear Nuevo Review')}
            </button>

            {showForm && (
                <div className="card p-3 mb-3">
                    <h2 className="mb-3">{editingReview ? 'Editar Review' : 'Nuevo Review'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="doctor-id" className="form-label">Doctor ID:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="doctor-id"
                                name="id_doctor"
                                value={newReview.id_doctor}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="patient-id" className="form-label">Paciente ID:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="patient-id"
                                name="id_patient"
                                value={newReview.id_patient}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Fecha:</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                name="date"
                                value={newReview.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="center-id" className="form-label">Centro ID:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="center-id"
                                name="id_center"
                                value={newReview.id_center}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Calificación:</label>
                            <div>
                                {renderStars()}
                                <span className="ms-2">({selectedRating})</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comments" className="form-label">Comentarios:</label>
                            <textarea
                                className="form-control"
                                id="comments"
                                name="comments"
                                value={newReview.comments}
                                onChange={handleInputChange}
                                rows="3"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingReview ? 'Guardar Cambios' : 'Enviar Review'}
                        </button>
                        {editingReview && (
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                                setEditingReview(null);
                                setShowForm(false);
                                setNewReview({ id_doctor: '', id_patient: '', date: '', id_center: '', rating: 0, comments: '' });
                                setRatingStars([false, false, false, false, false]);
                                setSelectedRating(0);
                            }}>
                                Cancelar
                            </button>
                        )}
                    </form>
                </div>
            )}

            {store.reviews.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Doctor ID</th>
                            <th>Paciente ID</th>
                            <th>Fecha</th>
                            <th>Centro ID</th>
                            <th>Calificación</th>
                            <th>Comentarios</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.reviews.map((review, index) => (
                            <tr key={index}>
                                <td>{review.id}</td>
                                <td>{review.id_doctor}</td>
                                <td>{review.id_patient}</td>
                                <td>{review.date}</td>
                                <td>{review.id_center}</td>
                                <td>{review.rating}</td>
                                <td>{review.comments}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-1"
                                        onClick={() => handleEditClick(review)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteClick(review.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay reseñas disponibles.</p>
            )}
            <Link to="/">
                <button className="btn btn-primary mt-3">Back Home</button>
            </Link>
        </div>
    );
};

export default Reviews;