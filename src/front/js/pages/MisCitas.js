import React, { useState, useEffect } from 'react';

function MisCitas() {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
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
            .then(response => response.json())
            .then(data => {
                setCitas(data.Appointments);
            })
            .catch(error => {
                console.error('Error al obtener las citas:', error);
                alert('Error al obtener las citas.');
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mis Citas</h2>

            {citas.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {citas.map(cita => (
                        <div key={cita.id} style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Efecto de sombra para la tarjeta
                        }}>
                            <p>Fecha: {cita.date}</p>
                            <p>Hora: {cita.hour}</p>
                            <p>Consultorio: {cita.id_center}</p>
                            <p>Doctor: {cita.id_doctor}</p>
                            <p>Especialidad: {cita.id_specialty}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No tienes citas agendadas.</p>
            )}
        </div>
    );
}

export default MisCitas;