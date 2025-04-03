import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";

export const PatientAppointments = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        } else {
            actions.getPatientAppointments();
        }
    }, [store.authPatient]);

    const handleRate = (appointmentId) => {
        navigate(`/rate-appointment/${appointmentId}`);
    };

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    return (
        <>
            {store.authPatient || localStorage.getItem("tokenpatient") ? (
                <div className="container">
                    <h1>Mis Citas</h1>
                    <button onClick={handleLogout}>Cerrar Sesión</button>

                    {store.patientAppointmentError && (
                        <p style={{ color: "red" }}>{store.patientAppointmentError}</p>
                    )}
                    {store.patientAppointments.length > 0 ? (
                        <ul>
                            {store.patientAppointments.map((appointment) => (
                                <li key={appointment.id}>
                                    Fecha: {appointment.date} | Hora: {appointment.hour} | 
                                    Doctor ID: {appointment.id_doctor} | 
                                    Centro ID: {appointment.id_center} | 
                                    Especialidad ID: {appointment.id_specialty} | 
                                    Estado: {appointment.confirmation}
                                    <button
                                        className="btn btn-primary ms-2"
                                        onClick={() => handleRate(appointment.id)}
                                    >
                                        Calificar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tienes citas registradas.</p>
                    )}
                    <br />
                    <Link to="/dashboardpatient">
                        <button className="btn btn-primary">Volver al Dashboard</button>
                    </Link>
                    <Link to="/">
                        <button className="btn btn-primary ms-2">Back Home</button>
                    </Link>
                </div>
            ) : (
                <Navigate to="/loginpatient" />
            )}
        </>
    );
};