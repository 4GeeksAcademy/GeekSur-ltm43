import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";

export const DoctorEdit = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: ""  // Para cambiar la contraseña si se desea
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor"); // Redirigir solo si no hay token ni auth
        } else if (!store.doctorPanelData) {
            actions.getDoctorPanel(); // Cargar datos si no hay datos del panel
        } else {
            // Rellenar los datos cuando los datos del doctor estén disponibles
            setFormData({
                first_name: store.doctorPanelData.doctor.first_name,
                last_name: store.doctorPanelData.doctor.last_name,
                email: store.doctorPanelData.doctor.email,
                phone_number: store.doctorPanelData.doctor.phone_number,
                password: "",  // Dejar vacío para no cambiar la contraseña a menos que el usuario lo desee
            });
        }
    }, [store.authDoctor, store.doctorPanelData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Llamada a la acción para actualizar los datos del doctor
            await actions.updateDoctor(store.doctorPanelData.doctor.id, formData);
            setSuccessMessage("Datos actualizados correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);  // Mostrar mensaje de éxito temporal
            setEditMode(false);  // Desactivar el modo de edición
            await actions.getDoctorPanel();  // Actualizar el panel con los nuevos datos
        } catch (error) {
            setError(error.message || "Error al actualizar los datos");
        }
    };

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const handleGoToPanel = () => {
        navigate("/paneldoctor");
    };

    return (
        <>
            {store.authDoctor === true || localStorage.getItem("tokendoctor") ? (
                <div className="container">
                    <h1>Bienvenido al Panel del Doctor</h1>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    {store.doctorPanelData ? (
                        <div>
                            <h3>Sus Datos Son Doctor</h3>
                            {editMode ? (
                                <form onSubmit={handleSubmit} className="card p-3 mt-3">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre:</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellido:</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Teléfono:</label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña (opcional):</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Dejar en blanco para no cambiar"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar Cambios
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="btn btn-outline-secondary ms-2"
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            ) : (
                                <div>
                                    <p><strong>Nombre:</strong> {store.doctorPanelData.doctor.first_name}</p>
                                    <p><strong>Apellido:</strong> {store.doctorPanelData.doctor.last_name}</p>
                                    <p><strong>Email:</strong> {store.doctorPanelData.doctor.email}</p>
                                    <p><strong>Teléfono:</strong> {store.doctorPanelData.doctor.phone_number}</p>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="btn btn-primary mt-3"
                                    >
                                        Editar Datos
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Cargando datos...</p>
                    )}

                    <button onClick={handleLogout} className="btn btn-secondary mb-3 mt-3">
                        Cerrar Sesión
                    </button>

                    <button onClick={handleGoToPanel} className="btn btn-primary mb-3 mt-3">
                        Ir al Panel
                    </button>
                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}
        </>
    );
};
