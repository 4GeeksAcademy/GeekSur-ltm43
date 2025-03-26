import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.tokendoctor) {
            navigate("/logindoctor"); 
        } else {
            actions.getDashboardDoctor(); 
        }
    }, [store.tokendoctor]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    return (
        <div className="container">

            {store.dashboardDoctorData ? (
                <div>
                    <p>Hola: , {store.dashboardDoctorData.first_name} {store.dashboardDoctorData.last_name}</p>
                    <p>Email: {store.dashboardDoctorData.email}</p>
                    <p>Teléfono: {store.dashboardDoctorData.phone_number}</p>
                    <button onClick={handleLogout}> Log Out</button>
                </div>
            ) : (
                <p>Ingresando a su DashBoard...</p>
            )}
            {store.loginDoctorError && <p style={{ color: "red" }}>{store.loginDoctorError}</p>}

        <br />
        <Link to="/">
        <button className="btn btn-primary">Back home</button>
        </Link>




        </div>
    );
};