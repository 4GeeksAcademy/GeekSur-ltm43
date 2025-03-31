import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, Link } from "react-router-dom";

export const DashboardPatient = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    console.log("se cargo dashboardPatient");

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    return (
        <>
            {store.authPatient || localStorage.getItem("tokenpatient") ? (
                <div className="container">
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                    <h1>Dashboard del Paciente</h1>
                    <Link to="/patient-appointments">
                        <button className="btn btn-primary">Ver Mis Citas</button>
                    </Link>
                    <br />
                    <Link to="/">
                        <button className="btn btn-primary">Back Home</button>
                    </Link>
                </div>
            ) : (
                <Navigate to="/loginpatient" />
            )}
        </>
    );
};