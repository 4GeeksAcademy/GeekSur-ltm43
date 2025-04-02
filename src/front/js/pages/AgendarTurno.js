import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function AgendarTurno() {
    const { id_doctor, specialtyId } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('07:15');
    const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
    const [medicalCenters, setMedicalCenters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener la lista de consultorios médicos
        fetch(process.env.BACKEND_URL + '/api/medical_centers')
            .then(response => response.json())
            .then(data => {
                console.log('Medical Centers:', data);
                setMedicalCenters(data);
            })
            .catch(error => {
                console.error('Error al obtener los consultorios:', error);
            });
    }, []);

    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleMedicalCenterChange = (event) => {
        setSelectedMedicalCenter(event.target.value);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('tokenpatient');

        if (!token) {
            alert('Debes iniciar sesión para agendar una cita.');
            return;
        }

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString().split('T')[0],
                    hour: selectedTime,
                    id_center: selectedMedicalCenter,
                    id_doctor: id_doctor,
                    id_specialty: specialtyId,
                })
            });

            if (!response.ok) {
                throw new Error('Error al agendar la cita.');
            }

            const citaAgendada = {
                fecha: selectedDate.toISOString().split('T')[0],
                hora: selectedTime,
                consultorio: selectedMedicalCenter,
                doctor: id_doctor,
                specialty: specialtyId,
            };

            navigate('/mis-citas', { state: { cita: citaAgendada } });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agendar la cita.');
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Agendar cita</h2>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Selecciona tu fecha</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={handleDateChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="time" style={{ display: 'block', marginBottom: '5px' }}>Selecciona tu hora</label>
                <input
                    type="time"
                    id="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="medicalCenter" style={{ display: 'block', marginBottom: '5px' }}>Selecciona el consultorio</label>
                <select
                    id="medicalCenter"
                    value={selectedMedicalCenter}
                    onChange={handleMedicalCenterChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                >
                    <option value="">Selecciona un consultorio</option>
                    {medicalCenters.map(center => (
                        <option key={center.id} value={center.id}>
                            {center.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>
                    Cancelar
                </button>
                <button
                    style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={handleSubmit}
                >
                    OK
                </button>
            </div>
        </div>
    );
}

export default AgendarTurno;