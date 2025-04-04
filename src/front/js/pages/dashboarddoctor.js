import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    console.log("se cargó dashboard Doctor");

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor"); // Redirigir solo si no hay token ni auth
        } else if (!store.dashboardDoctorData) {
            actions.getDashboardDoctor(); // Cargar datos si hay token pero no datos
            actions.getDoctorPanel(); // Cargar datos si no hay datos del panel
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
                    
                    <h3>DASHBOARD</h3>
                    <h2>Hola Doctor: {store.dashboardDoctorData?.first_name || "Usuario"}</h2>
                    <h4>¿Que desea hacer?</h4>
                    <Link to="/paneldoctor">
                    <button className="btn btn-success">Edite sus datos</button>
                    </Link>

                    <Link to="/paneldoctor">
                    <button className="btn btn-danger">revisar</button>
                    </Link>

                  
                    <button onClick={handleLogout}>Cerrar Sesión</button>


                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}

            <br />

        </>
    );
};
