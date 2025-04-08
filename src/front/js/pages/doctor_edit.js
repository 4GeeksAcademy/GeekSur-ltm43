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
        password: "",
    });
    const [photo, setPhoto] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
    }, [store.authDoctor, store.doctorPanelData]);

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

            await actions.updateDoctor(data);  // Quitamos el ID aquí
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

    const handleGoToPanel = () => {
        navigate("/paneldoctor");
    };

    return (
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
                <div className="container">
                    <h1>Bienvenido al Panel del Doctor</h1>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    {store.doctorPanelData ? (
                        <div>
                            <h3>Sus Datos Son Doctor</h3>
                            {editMode ? (
                                <form onSubmit={handleSubmit} className="card p-3 mt-3" encType="multipart/form-data">
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
                                    <div className="mb-3">
                                        <label className="form-label">Foto de perfil:</label>
                                        {store.doctorPanelData.doctor.url && !removePhoto && (
                                            <div>
                                                <img
                                                    src={store.doctorPanelData.doctor.url}
                                                    alt="Foto actual"
                                                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="btn btn-danger btn-sm ms-2"
                                                >
                                                    Eliminar Foto
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="photo"
                                            onChange={handleFileChange}
                                            className="form-control mt-2"
                                            accept="image/*"
                                            disabled={removePhoto}
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
                                    {store.doctorPanelData.doctor.url && (
                                        <img
                                            src={store.doctorPanelData.doctor.url}
                                            alt="Foto de perfil"
                                            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                        />
                                    )}
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