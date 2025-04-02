import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

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
        return <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            backgroundColor: '#4A6572',
            color: 'white'
        }}>Cargando...</div>;
    }
console.log(doctor);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            backgroundColor: 'rgb(225 250 255)' 
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
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '20px', backgroundColor: 'lightgray', overflow: 'hidden' }}>
                            {doctor.image_url ? (
                                <img src={doctor.image_url} alt="Doctor" style={{ width: '100%', height: '120%', objectFit: 'cover' }} />
                            ) : (
                                <img src="https://i.pinimg.com/736x/61/6d/72/616d72665562e4aa8acc755fb5401d90.jpg" alt="Doctor" style={{ width: '110%', height: '100%', objectFit: 'cover' }} />
                            )}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8em', marginBottom: '10px', color: 'white' }}>{doctor.first_name} {doctor.last_name}</h2>
                            <div style={{ marginBottom: '15px' }}>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaPhone style={{ marginRight: '8px' }} /> 
                                    Teléfono: {doctor.phone_number}
                                </p>
                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaEnvelope style={{ marginRight: '8px' }} /> 
                                    Email: {doctor.email}
                                </p>     
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <button
                                    style={{ backgroundColor: 'rgb(93 177 212)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }} // Agregar margen derecho
                                    onClick={handleBookAppointment}
                                >
                                    Agendar Turno
                                </button>
                                <button
                                    style={{ backgroundColor: 'rgb(93 177 212)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} // Agregar display flex y alinear
                                >
                                    <FaWhatsapp style={{ marginRight: '8px' }} /> {/* Icono de WhatsApp */}
                                    Enviar Mensaje
                                </button>
                            </div>
                        </div>
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
                <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: 'white', borderRadius: '5px', color: 'black' }}>
                    <p>Información sobre las coberturas del doctor.</p>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfile;