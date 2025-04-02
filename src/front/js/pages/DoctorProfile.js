import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DoctorProfile() {
    const { doctorId, specialtyId} = useParams();
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(process.env.BACKEND_URL + `/api/doctors/${doctorId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos del backend:', data);
                setDoctor(data);
            })
            .catch(error => console.error('Error:', error));
    }, [doctorId]);

    const handleBookAppointment = () => {
        navigate('/agendar-turno/' + doctorId+"/"+specialtyId);
    };

    if (!doctor) {
        return <div>Cargando...</div>;
    }
console.log(doctor);

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.8em', marginBottom: '10px' }}>{doctor.first_name} {doctor.last_name}</h2>
                    <div style={{ marginBottom: '15px' }}>
                        <p>Teléfono: {doctor.phone_number}</p>
                        <p>Email: {doctor.email}</p>
                    </div>
                    <button
                        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={handleBookAppointment}
                    >
                        Agendar Turno
                    </button>
                    <button
                        style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Enviar Mensaje
                    </button>
                </div>
            </div>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', marginRight: '5px', cursor: 'pointer' }}>
                    Experiencia
                </button>
                <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', marginRight: '5px', cursor: 'pointer' }}>
                    Reviews
                </button>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                <p>Información sobre las coberturas del doctor.</p>
            </div>
        </div>
    );
}

export default DoctorProfile;