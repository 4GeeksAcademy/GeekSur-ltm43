import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from 'react-icons/fa';

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // --- Estados Locales ---
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        gender: '',
        birth_date: '',
        password: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        console.log(store.tokenpatient);
        
        if (!store.tokenpatient && !store.processingAction) {
            navigate("/loginpatient");
        } else if (store.tokenpatient) {
            if (!store.dashboardPatientData || !isEditing) {
                actions.getDashboardPatient();
            }
        }
    }, [store.tokenpatient, store.processingAction, navigate, actions, isEditing]);

    useEffect(() => {
        if (store.dashboardPatientData) {
            setFormData({
                first_name: store.dashboardPatientData.first_name || '',
                last_name: store.dashboardPatientData.last_name || '',
                email: store.dashboardPatientData.email || '',
                phone_number: store.dashboardPatientData.phone_number || '',
                gender: store.dashboardPatientData.gender || '',
                birth_date: store.dashboardPatientData.birth_date || ''
            });
        }
    }, [store.dashboardPatientData]);

    const handleLogout = () => {
        actions.logoutPatient();
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
                birth_date: store.dashboardPatientData.birth_date || ''
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
                birth_date: store.dashboardPatientData.birth_date || ''
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

    return (
        <div className="container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: 'rgb(225 250 255)' 
        }}>
            {store.dashboardPatientData ? (
                <div style={{ 
                    backgroundColor: 'rgb(152 210 237)', 
                    padding: '40px', 
                    borderRadius: '10px', 
                    width: '700px', 
                    textAlign: 'center' 
                }}>
                    <h1 style={{ color: 'white', marginBottom: '30px' }}>Mi Perfil</h1>
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} style={{ display: 'flex', flexDirection: 'column' }}>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Nombre" required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Apellido" required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            <select name="gender" value={formData.gender} onChange={handleInputChange} required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving}>
                                <option value="">Selecciona</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                            </select>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Contraseña" required style={{ padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Teléfono" required style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '5px' }} disabled={isSaving} />
                            {updateError && <p style={{ color: 'red', marginBottom: '10px' }}>{updateError}</p>}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#344955', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} disabled={isSaving}>
                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button type="button" onClick={handleCancelClick} style={{ padding: '10px 20px', backgroundColor: '#232F34', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} disabled={isSaving}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p style={{ color: 'white' }}><strong>Bienvenido,</strong> {store.dashboardPatientData.first_name} {store.dashboardPatientData.last_name}</p>
                            <p style={{ color: 'white' }}><strong>Email:</strong> {store.dashboardPatientData.email}</p>
                            <p style={{ color: 'white' }}><strong>Teléfono:</strong> {store.dashboardPatientData.phone_number}</p>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleEditClick} style={{ padding: '10px 20px', backgroundColor: 'rgb(93 177 212)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <FaPencilAlt style={{ marginRight: '8px' }} /> 
                                    Editar Mi Perfil
                                </button>
                                <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: 'rgb(173 29 29)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p style={{ color: 'white' }}>Cargando datos...</p>
            )}
            {store.loginPatientError && <p style={{ color: 'red', marginTop: '10px' }}>{store.loginPatientError}</p>}
        </div>
    );
};