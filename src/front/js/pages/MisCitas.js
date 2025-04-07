import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate, Link } from 'react-router-dom';

function MisCitas() {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [citas, setCitas] = useState([]);

    const fetchCitas = async () => {
        const token = localStorage.getItem('tokenpatient');

        if (!token) {
            alert('Debes iniciar sesión para ver tus citas.');
            navigate('/loginpatient');
            return;
        }

        try {
            await actions.getPatientAppointments(); // Usa la acción que filtra por paciente logueado
            setCitas(store.patientAppointments || []);
        } catch (error) {
            console.error('Error al obtener las citas:', error);
            alert(`Error al obtener las citas: ${error.message}`);
            setCitas([]);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, []);

    const handleCancelarCita = (citaId) => {
        const confirmacion = window.confirm("¿Estás seguro de eliminar la cita?");

        if (confirmacion) {
            const token = localStorage.getItem('tokenpatient');
            if (!token) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
                navigate('/loginpatient');
                return;
            }

            fetch(`${process.env.BACKEND_URL}/api/appointments/${citaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || `Error del servidor: ${response.status}`);
                    }).catch(() => {
                        throw new Error(`Error al cancelar la cita. Estado: ${response.status}`);
                    });
                }
                alert('Cita cancelada exitosamente.');
                fetchCitas(); // Refresca la lista tras eliminar
            })
            .catch(error => {
                console.error('Error al cancelar la cita:', error);
                alert(`Error al cancelar la cita: ${error.message}`);
            });
        }
    };

    const handleRate = (appointmentId) => {
        navigate(`/rate-appointment/${appointmentId}`);
    };

    const handleLogout = () => {
        actions.logoutPatient();
        navigate('/loginpatient');
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            backgroundColor: 'rgb(225 250 255)', 
            padding: '20px' 
        }}>
            <div style={{ 
                backgroundColor: 'rgb(152 210 237)', 
                padding: '40px', 
                borderRadius: '10px', 
                width: '90%', 
                maxWidth: '960px', 
                textAlign: 'left', 
                color: 'white' 
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Mis Citas :</h2>

                {Array.isArray(citas) && citas.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {citas.map(cita => (
                            <div key={cita.id} style={{
                                border: '5px double #ccc',
                                borderRadius: '8px',
                                padding: '20px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: 'white',
                                color: 'black',
                                margin: '10px 0'
                            }}>
                                <div>
                                    <p><strong>Fecha:</strong> {cita.date}</p>
                                    <p><strong>Hora:</strong> {cita.hour}</p>
                                    <p><strong>Consultorio:</strong> {cita.id_center}</p>
                                    <p><strong>Doctor:</strong> {cita.id_doctor}</p>
                                    <p><strong>Especialidad:</strong> {cita.id_specialty}</p>
                                    <p><strong>Estado:</strong> {cita.confirmation}</p>
                                </div>
                                <div style={{ marginTop: '15px' }}>
                                    <button
                                        onClick={() => handleCancelarCita(cita.id)}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: 'rgb(173 29 29)', // Color rojo para cancelar
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >
                                        Cancelar Cita
                                    </button>
                                    <button
                                        onClick={() => handleRate(cita.id)}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: 'rgb(93 177 212)', // Color azul para calificar
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Calificar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>No tienes citas agendadas.</p>
                )}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button onClick={handleLogout} style={{
                        padding: '10px 20px',
                        backgroundColor: 'rgb(173 29 29)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Cerrar Sesión
                    </button>
                    <Link to="/dashboardpatient" style={{ marginLeft: '10px' }}>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: 'rgb(93 177 212)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Volver al Dashboard
                        </button>
                    </Link>
                    <Link to="/" style={{ marginLeft: '10px' }}>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: 'rgb(93 177 212)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
                            Back Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MisCitas;