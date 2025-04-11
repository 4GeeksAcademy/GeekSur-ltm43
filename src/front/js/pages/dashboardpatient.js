import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { FaPencilAlt } from 'react-icons/fa';

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        gender: '',
        birth_date: '',
        password: '',
        historial_clinico: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [updateError, setUpdateError] = useState('');

    const medicalCenters = store.medical_center_doctor || [];
    const firstMedicalCenter = medicalCenters.length > 0 ? medicalCenters[0] : null;
    const city = store.dashboardPatientData?.city || firstMedicalCenter?.city || "San Francisco";
    const country = store.dashboardPatientData?.country || firstMedicalCenter?.country || "CA";
    const location = `${city}, ${country}`;

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
        const token = store.tokenpatient || localStorage.getItem("tokenpatient");
        if (store.authPatient && token && (!store.dashboardPatientData || !isEditing)) {
            actions.getDashboardPatient();
        }
    }, [store.authPatient, store.tokenpatient, isEditing]);

    useEffect(() => {
        if (store.dashboardPatientData) {
            setFormData({
                first_name: store.dashboardPatientData.first_name || '',
                last_name: store.dashboardPatientData.last_name || '',
                email: store.dashboardPatientData.email || '',
                phone_number: store.dashboardPatientData.phone_number || '',
                gender: store.dashboardPatientData.gender || '',
                birth_date: store.dashboardPatientData.birth_date || '',
                historial_clinico: store.dashboardPatientData.historial_clinico || ''
            });
        }
    }, [store.dashboardPatientData]);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setUpdateError('');
        if (store.dashboardPatientData) {
            setFormData({
                first_name: store.dashboardPatientData.first_name || '',
                last_name: store.dashboardPatientData.last_name || '',
                email: store.dashboardPatientData.email || '',
                phone_number: store.dashboardPatientData.phone_number || '',
                gender: store.dashboardPatientData.gender || '',
                birth_date: store.dashboardPatientData.birth_date || '',
                historial_clinico: store.dashboardPatientData.historial_clinico || ''
            });
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setUpdateError('');
        if (store.dashboardPatientData) {
            setFormData({
                first_name: store.dashboardPatientData.first_name || '',
                last_name: store.dashboardPatientData.last_name || '',
                email: store.dashboardPatientData.email || '',
                phone_number: store.dashboardPatientData.phone_number || '',
                gender: store.dashboardPatientData.gender || '',
                birth_date: store.dashboardPatientData.birth_date || '',
                historial_clinico: store.dashboardPatientData.historial_clinico || ''
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setUpdateError('');
        try {
            const success = await actions.updatePatientProfile(formData);
            if (success) {
                setIsEditing(false);
            } else {
                setUpdateError("No se pudo actualizar el perfil. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            setUpdateError(error.message || "Ocurrió un error al guardar los cambios.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
        return <Navigate to="/loginpatient" />;
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: 'rgb(225 250 255)' }}>
            <div style={{ width: '250px', backgroundColor: 'rgb(100 191 208)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h2 style={{ color: 'white', marginBottom: '30px' }}>Patient Dashboard</h2>
                <Link to="/ver-mis-citas" style={{ color: 'white', textDecoration: 'none', marginBottom: '10px' }}>Mi Perfil</Link>
                <Link to="/mis-especialidades" style={{ color: 'white', textDecoration: 'none', marginBottom: '10px' }}>Mis Citas</Link>
                <Link to="/mis-oficinas" style={{ color: 'white', textDecoration: 'none', marginBottom: '10px' }}>Historial Medico</Link>
                <Link to="/search-professionals" style={{ color: 'white', textDecoration: 'none', marginBottom: '10px' }}>Buscar y Agendar Profesional</Link>
                <button onClick={handleLogout} type="button" className="btn btn-danger" style={{ marginTop: 'auto', width: 'auto' }}>
                    Cerrar Sesión
                </button>
            </div>

            <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>{location}</span>
                    <span>{currentTime}</span>
                </div>

                {store.dashboardPatientData && store.authPatient ? (
                    <div>
                        <h1 style={{ color: 'black', marginBottom: '20px' }}>Hello, {store.dashboardPatientData.first_name} {store.dashboardPatientData.last_name}</h1>
                        <p>Here's a summary of your activity this week.</p>

                        {/* Tarjetas */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '30px' }}>
                            {/* Mi Perfil */}
                            <div style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '40%', marginRight: '20px' }}>
                                <h3>Mi Perfil</h3>
                                {isEditing ? (
                                    <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Nombre" required disabled={isSaving} />
                                        <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Apellido" required disabled={isSaving} />
                                        <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} required disabled={isSaving} />
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} required disabled={isSaving}>
                                            <option value="">Selecciona</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </select>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required disabled={isSaving} />
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" disabled={isSaving} />
                                        <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Teléfono" required disabled={isSaving} />
                                        <textarea name="historial_clinico" value={formData.historial_clinico} onChange={handleInputChange} placeholder="Historial Clínico" disabled={isSaving} />
                                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
                                            <button type="button" onClick={handleCancelClick} disabled={isSaving}>Cancelar</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <p><strong>Bienvenido,</strong> {store.dashboardPatientData.first_name} {store.dashboardPatientData.last_name}</p>
                                        <p><strong>Email:</strong> {store.dashboardPatientData.email}</p>
                                        <p><strong>Teléfono:</strong> {store.dashboardPatientData.phone_number}</p>
                                        <p><strong>Historial Clínico:</strong> {store.dashboardPatientData.historial_clinico || 'No disponible'}</p>
                                        <button onClick={handleEditClick} type="button" className="btn btn-primary">
                                            <FaPencilAlt style={{ marginRight: '8px' }} />
                                            Editar Mi Perfil
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Otras tarjetas */}
                            <div style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '25%', marginRight: '20px' }}>
                                <h3>Citas Próximas</h3>
                                <p>0</p>
                                <p>Ver detalles</p>
                            </div>
                            <div style={{ backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '25%' }}>
                                <h3>Historial Clínico</h3>
                                <p>1</p>
                                <p>Gestionar</p>
                            </div>
                        </div>
                        <button onClick={() => navigate("/ai-consultation")} style={{ padding: '10px 20px', backgroundColor: 'rgb(93 177 212)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Consultar con IA
                        </button>

                    </div>
                ) : (
                    <p>Cargando datos...</p>
                )}
                {store.loginPatientError && <p style={{ color: 'red', marginTop: '10px' }}>{store.loginPatientError}</p>}
            </div>
        </div>
    );
};

export default DashboardPatient;
