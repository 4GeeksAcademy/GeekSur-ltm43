import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DoctorAppointment = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            console.log("Cargando citas para el doctor con token:", localStorage.getItem("tokendoctor"));
            actions.getDoctorAppointments();
        }
    }, [store.authDoctor]);
    
    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    const handleManageAppointment = (appointmentId, action) => {
        actions.manageDoctorAppointment(appointmentId, action);
    };

    return (
        <div className="container">
            <h1>Mis Citas</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>

            {store.doctorAppointments && store.doctorAppointments.length > 0 ? (
                <ul>
                    {store.doctorAppointments.map((appointment) => (
                        <li key={appointment.id}>
                            Fecha: {appointment.date} | Hora: {appointment.hour} | 
                            Paciente ID: {appointment.id_patient} | 
                            Centro ID: {appointment.id_center} | 
                            Especialidad ID: {appointment.id_specialty} | 
                            Estado: {appointment.confirmation}
                            <div>
                                <button onClick={() => handleManageAppointment(appointment.id, "cancel")}>
                                    Cancelar
                                </button>
                                <button onClick={() => handleManageAppointment(appointment.id, "complete")}>
                                    Marcar como Hecha
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes citas programadas.</p>
            )}

            <br />
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>
        </div>
    );
};