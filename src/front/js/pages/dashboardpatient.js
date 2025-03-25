import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.tokenpatient) {
            navigate("/loginpatient"); // Redirigir al login si no hay token
        } else {
            actions.getDashboardPatient(); // Cargar los datos del dashboard
        }
    }, [store.tokenpatient]);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    return (
        <div className="container">
            <h1>Dashboard del Paciente</h1>
            {store.dashboardPatientData ? (
                <div>
                    <p>Bienvenido, {store.dashboardPatientData.first_name} {store.dashboardPatientData.last_name}</p>
                    <p>Email: {store.dashboardPatientData.email}</p>
                    <p>Teléfono: {store.dashboardPatientData.phone_number}</p>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
            {store.loginPatientError && <p style={{ color: "red" }}>{store.loginPatientError}</p>}
        </div>
    );
};