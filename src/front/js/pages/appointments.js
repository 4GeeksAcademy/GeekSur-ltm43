import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"; 

const Appointments = () => {
    const { store, actions } = useContext(Context);
    
    const [newAppointment, setNewAppointment] = useState({
        id_patient: "",
        id_doctor: "",
        id_center: "",
        date: "",
        hour: "",
        id_specialty: "",
        confirmation: "to_be_confirmed"
    });

    const [updateAppointment, setUpdateAppointment] = useState({
        id: "",
        id_patient: "",
        id_doctor: "",
        id_center: "",
        date: "",
        hour: "",
        id_specialty: "",
        confirmation: ""
    });

    useEffect(() => {
        actions.getAppointments();
    }, []);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        actions.createAppointment({
            id_patient: parseInt(newAppointment.id_patient),
            id_doctor: parseInt(newAppointment.id_doctor),
            id_center: parseInt(newAppointment.id_center),
            date: newAppointment.date,
            hour: newAppointment.hour,
            id_specialty: parseInt(newAppointment.id_specialty),
            confirmation: newAppointment.confirmation
        });
        setNewAppointment({
            id_patient: "",
            id_doctor: "",
            id_center: "",
            date: "",
            hour: "",
            id_specialty: "",
            confirmation: "to_be_confirmed"
        });
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const updateData = {};
        if (updateAppointment.id_patient) updateData.id_patient = parseInt(updateAppointment.id_patient);
        if (updateAppointment.id_doctor) updateData.id_doctor = parseInt(updateAppointment.id_doctor);
        if (updateAppointment.id_center) updateData.id_center = parseInt(updateAppointment.id_center);
        if (updateAppointment.date) updateData.date = updateAppointment.date;
        if (updateAppointment.hour) updateData.hour = updateAppointment.hour;
        if (updateAppointment.id_specialty) updateData.id_specialty = parseInt(updateAppointment.id_specialty);
        if (updateAppointment.confirmation) updateData.confirmation = updateAppointment.confirmation;

        actions.updateAppointment(updateAppointment.id, updateData);
        setUpdateAppointment({
            id: "",
            id_patient: "",
            id_doctor: "",
            id_center: "",
            date: "",
            hour: "",
            id_specialty: "",
            confirmation: ""
        });
    };

    return (
        <div>
            <h1>Appointments Test</h1>

            <h2>Create Appointment</h2>
            <form onSubmit={handleCreateSubmit}>
                <input
                    type="number"
                    placeholder="Patient ID"
                    value={newAppointment.id_patient}
                    onChange={(e) => setNewAppointment({ ...newAppointment, id_patient: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Doctor ID"
                    value={newAppointment.id_doctor}
                    onChange={(e) => setNewAppointment({ ...newAppointment, id_doctor: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Medical Center ID"
                    value={newAppointment.id_center}
                    onChange={(e) => setNewAppointment({ ...newAppointment, id_center: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    required
                />
                <input
                    type="time"
                    value={newAppointment.hour}
                    onChange={(e) => setNewAppointment({ ...newAppointment, hour: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Specialty ID"
                    value={newAppointment.id_specialty}
                    onChange={(e) => setNewAppointment({ ...newAppointment, id_specialty: e.target.value })}
                    required
                />
                <select
                    value={newAppointment.confirmation}
                    onChange={(e) => setNewAppointment({ ...newAppointment, confirmation: e.target.value })}
                >
                    <option value="to_be_confirmed">To Be Confirmed</option>
                    <option value="confirmed">Confirmed</option>
                </select>
                <button type="submit">Create</button>
            </form>

            <h2>Update Appointment</h2>
            <form onSubmit={handleUpdateSubmit}>
                <input
                    type="number"
                    placeholder="Appointment ID"
                    value={updateAppointment.id}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, id: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Patient ID (optional)"
                    value={updateAppointment.id_patient}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, id_patient: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Doctor ID (optional)"
                    value={updateAppointment.id_doctor}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, id_doctor: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Medical Center ID (optional)"
                    value={updateAppointment.id_center}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, id_center: e.target.value })}
                />
                <input
                    type="date"
                    value={updateAppointment.date}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, date: e.target.value })}
                />
                <input
                    type="time"
                    value={updateAppointment.hour}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, hour: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Specialty ID (optional)"
                    value={updateAppointment.id_specialty}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, id_specialty: e.target.value })}
                />
                <select
                    value={updateAppointment.confirmation}
                    onChange={(e) => setUpdateAppointment({ ...updateAppointment, confirmation: e.target.value })}
                >
                    <option value="">No Change</option>
                    <option value="to_be_confirmed">To Be Confirmed</option>
                    <option value="confirmed">Confirmed</option>
                </select>
                <button type="submit">Update</button>
            </form>

            <h2>All Appointments</h2>
            <button onClick={() => actions.getAppointments()}>Refresh</button>
            {store.appointmentError && <p style={{color: 'red'}}>{store.appointmentError}</p>}
            {store.appointmentSuccessMessage && <p style={{color: 'green'}}>{store.appointmentSuccessMessage}</p>}
            <ul>
                {store.appointments.map(appointment => (
                    <li key={appointment.id}>
                        ID: {appointment.id} | Patient: {appointment.id_patient} | Doctor: {appointment.id_doctor} | 
                        Center: {appointment.id_center} | Date: {appointment.date} | Hour: {appointment.hour} | 
                        Specialty: {appointment.id_specialty} | Status: {appointment.confirmation}
                        <button onClick={() => actions.deleteAppointment(appointment.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <br />
                <Link to="/">
                    <button className="btn btn-primary">Back home</button>
                </Link>
        </div>
    );
};

export default Appointments;