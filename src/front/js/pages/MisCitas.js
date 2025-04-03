import React, { useState, useEffect } from 'react';

function MisCitas() {
    const [citas, setCitas] = useState([]);

    const fetchCitas = () => {
        const token = localStorage.getItem('tokenpatient');

        if (!token) {
            alert('Debes iniciar sesión para ver tus citas.');
            return;
        }

        fetch(process.env.BACKEND_URL + '/api/appointments/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setCitas(Array.isArray(data.Appointments) ? data.Appointments : []);
        })
        .catch(error => {
            console.error('Error al obtener las citas:', error);
            alert(`Error al obtener las citas: ${error.message}`);
            setCitas([]);
        });
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
                setCitas(prevCitas => prevCitas.filter(cita => cita.id !== citaId));
            })
            .catch(error => {
                console.error('Error al cancelar la cita:', error);
                alert(`Error al cancelar la cita: ${error.message}`);
            });
        }
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
                                </div>

                                <button
                                    onClick={() => handleCancelarCita(cita.id)}
                                    style={{
                                        marginTop: '15px',
                                        padding: '8px 15px',
                                        backgroundColor: 'rgb(93 177 212)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar Cita
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>No tienes citas agendadas.</p>
                )}
            </div>
        </div>
    );
}

export default MisCitas;