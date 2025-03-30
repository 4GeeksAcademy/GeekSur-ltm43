import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    console.log("se cargo dashboard Doctor");

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor"); // Redirigir solo si no hay token ni auth
        } else if (!store.dashboardDoctorData) {
            actions.getDashboardDoctor(); // Cargar datos si hay token pero no datos
        }
    }, [store.authDoctor, store.dashboardDoctorData]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    return (
        <>
            {store.authDoctor === true || localStorage.getItem("tokendoctor") ? (
                <div className="container">
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                    <h1>Dashboard del Doctor</h1>
                    <p>Bienvenido, {store.currentDoctor?.first_name || "Doctor"}</p>
                    <Link to="/doctor-appointment">
                        <button className="btn btn-primary">Ver Mis Citas</button>
                    </Link>
                    <br />
                    <Link to="/">
                        <button className="btn btn-primary">Back home</button>
                    </Link>
                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}
        </>
    );
};