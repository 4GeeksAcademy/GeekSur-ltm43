import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const PanelDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

   
    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor"); // Redirigir solo si no hay token ni auth
        } else if (!store.doctorPanelData) {
            actions.getDoctorPanel(); 
        }
    }, [store.authDoctor, store.doctorPanelData]);

    const handleLogout = () => {
        actions.logoutDoctor();
        navigate("/logindoctor");
    };

    return (
        <>
            {store.authDoctor === true || localStorage.getItem("tokendoctor") ? (
                
                <div className="container">
                    <h1>Bienvenido al Panel del Doctor</h1>

                    {/* Mostrar datos del doctor */}
                    {store.doctorPanelData ? (
                        <div>
                            <h3>Sus Datos Son</h3>
                            <p><strong>Nombre:</strong> {store.doctorPanelData.doctor.first_name} {store.doctorPanelData.doctor.last_name}</p>
                            <p><strong>Email:</strong> {store.doctorPanelData.doctor.email}</p>
                            <p><strong>Teléfono:</strong> {store.doctorPanelData.doctor.phone_number}</p>

                            {/* Mostrar especialidades si existen */}
                            <h3>Especialidades</h3>
                            {store.doctorPanelData.doctor.specialties && store.doctorPanelData.doctor.specialties.length > 0 ? (
                                <ul>
                                    {store.doctorPanelData.doctor.specialties.map(spec => (
                                        <li key={spec.id}>{spec.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tiene especialidades asignadas.</p>
                            )}

                            {/* Mostrar centros médicos y oficinas si existen */}
                            <h3>Centros Médicos</h3>
                            {store.doctorPanelData.doctor.medical_centers && store.doctorPanelData.doctor.medical_centers.length > 0 ? (
                                <ul>
                                    {store.doctorPanelData.doctor.medical_centers
                                        .sort((a, b) => {
                                            // Primero ordenamos por nombre del centro (a.name vs b.name)
                                            if (a.name < b.name) return -1;
                                            if (a.name > b.name) return 1;

                                            // Si los nombres son iguales, ordenamos por el número de oficina (a.office vs b.office)
                                            if (a.office < b.office) return -1;
                                            if (a.office > b.office) return 1;

                                            return 0; // Si son iguales, no hacemos ningún cambio
                                        })
                                        .map(center => (
                                            <li key={center.id}>
                                                {center.name} - Oficina: {center.office}
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>No tiene centros médicos asignados.</p>
                            )}

                        </div>
                    ) : (
                        <p>Cargando datos...</p>
                    )}

                    <div className="d-flex gap-2 mt-3">

                    <Link to="/doctor_edit">
                        <button type="submit" className="btn btn-primary">Editar Datos Personales</button>
                   </Link>

                   <Link to="/doctor_edit_specialty">
                        <button type="submit" className="btn btn-primary">Editar Especialidades</button>
                   </Link>

                   <Link to="/center_office_by_doctor">
                        <button type="submit" className="btn btn-primary">Centros Medicos</button>
                   </Link>
                          
                    <Link to="/doctor-appointment">
                        <button className="btn btn-primary w-100">Ver Mis Citas</button>
                    </Link>

                   <Link to="/dashboarddoctor">
                        <button type="submit" className="btn btn-primary">Ir a DashBoard</button>
                   </Link>
                
                    <button onClick={handleLogout} className="btn btn-secondary mb-3">
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
