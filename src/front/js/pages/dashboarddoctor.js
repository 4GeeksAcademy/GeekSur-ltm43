import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const DashboardDoctor = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
      navigate("/logindoctor"); // Redirigir si no hay token ni auth
    } else if (!store.dashboardDoctorData) {
      actions.getDashboardDoctor(); // Cargar datos del dashboard
      actions.getDoctorPanel(); // Cargar datos del panel
    }
  }, [store.authDoctor, store.dashboardDoctorData]);

  const handleLogout = () => {
    actions.logoutDoctor();
    navigate("/logindoctor");
  };

  return (
    <>
      {store.authDoctor || localStorage.getItem("tokendoctor") ? (
        <div className="container text-center mt-5">
          <h3>DASHBOARD</h3>
          <h2>
            Hola Doctor: {store.dashboardDoctorData?.first_name || "Usuario"}
          </h2>
          <h4>¿Qué desea hacer?</h4>

          <div className="d-flex flex-column gap-3 mt-4" style={{ maxWidth: "300px", margin: "0 auto" }}>
            {/* Botón 1: Ver citas asignadas */}
            <Link to="/doctor_appointment">
              <button className="btn btn-primary w-100">Ver Mis Citas</button>
            </Link>

            {/* Botón 2: Editar especialidades */}
            <Link to="/doctor_edit_specialty">
              <button className="btn btn-primary w-100">Mis Especialidades</button>
            </Link>

            {/* Botón 3: Editar oficinas */}
            <Link to="/center_office_by_doctor">
              <button className="btn btn-primary w-100">Mis Oficinas</button>
            </Link>

            {/* Botón 4: Ver perfil */}
            <Link to="/paneldoctor">
              <button className="btn btn-primary w-100">Mi Perfil</button>
            </Link>

            {/* Botón de cerrar sesión */}
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