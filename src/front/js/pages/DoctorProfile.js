import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorProfile() {
    const navigate = useNavigate(); 

    const handleBookAppointment = () => {
        navigate('/agendar-turno');
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                <img
                    src="https://i.pinimg.com/736x/6c/2b/66/6c2b662df52690e7a12921590d9e5637.jpg"
                    alt="Doctor"
                    style={{ width: '150px', height: '150px', borderRadius: '50%', marginRight: '20px' }}
                />
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.8em', marginBottom: '10px' }}>Nombre del Doctor</h2>
                    <p>
                        Especialidades: Especialidad 1, Especialidad 2, Especialidad 3
                    </p>
                    <p style={{ marginBottom: '10px' }}>
                        Descripción: Profesional que practica la medicina y que intenta mantener y recuperar la salud mediante el estudio, el diagnóstico y el tratamiento de la enfermedad o lesión del paciente.
                    </p>
                    <div style={{ marginBottom: '15px' }}>
                        <p>Dirección: Calle, Número, Ciudad, País</p>
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