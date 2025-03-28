import React, { useState } from 'react';

function AgendarTurno() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('07:15');

    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
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
                <label htmlFor="time" style={{ display: 'block', marginBottom: '5px' }}>Selecciona el consultorio</label>
                <input
                    type="location"
                    id="location"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>
                    Cancelar
                </button>
                <button style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default AgendarTurno;