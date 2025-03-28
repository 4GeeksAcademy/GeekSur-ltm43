import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    console.log("se cargo dashboardPatient")
    // useEffect(() => {
    //     if (!store.authPatient) {
    //          navigate("/loginpatient"); // Redirigir al login si no hay token
    //     } else {
    //         actions.getDashboardPatient(); // Cargar los datos del dashboard
    //     }
    // }, [store.authPatient]);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    return (
        <>
        {store.authPatient === true || localStorage.getItem("tokenpatient") ? 
            <div className="container">
                <button onClick={handleLogout}>Cerrar Sesión</button>
                <h1>Dashboard del Paciente</h1>
                
            </div>
        
        : <Navigate to="/loginpatient"/>}
        
        </>
    );
};