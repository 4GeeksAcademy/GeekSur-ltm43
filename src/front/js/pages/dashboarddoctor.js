import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DashboardDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor"); // Redirigir si no está autenticado
        } else {
            actions.getDoctorPanel(); // Siempre cargar los datos al entrar
        }
    }, [store.authDoctor, actions]); // Dependencias: authDoctor y actions

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    return (
        <>
            {store.authDoctor || localStorage.getItem("tokendoctor") ? (
                <div className="container text-center mt-5">
                    <h3>DASHBOARD</h3>
                    {store.doctorPanelData?.doctor?.url && (
                        <div className="mb-4">
                            <img
                                src={store.doctorPanelData.doctor.url}
                                alt="Foto de perfil"
                                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                            />
                            <p>
                                Bienvenido, {store.doctorPanelData.doctor.first_name}{" "}
                                {store.doctorPanelData.doctor.last_name}
                            </p>
                        </div>
                    )}
                    <h4>¿Qué desea hacer?</h4>

                    <div className="d-flex flex-column gap-3 mt-4" style={{ maxWidth: "300px", margin: "0 auto" }}>
                        <Link to="/doctor-appointment">
                            <button className="btn btn-primary w-100">Ver Mis Citas</button>
                        </Link>
                        <Link to="/doctor_edit_specialty">
                            <button className="btn btn-primary w-100">Mis Especialidades</button>
                        </Link>
                        <Link to="/center_office_by_doctor">
                            <button className="btn btn-primary w-100">Mis Oficinas</button>
                        </Link>
                        <Link to="/paneldoctor">
                            <button className="btn btn-primary w-100">Mi Perfil</button>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary w-100 mt-3">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            ) : (
                <Navigate to="/logindoctor" />
            )}
        </>
    );
};