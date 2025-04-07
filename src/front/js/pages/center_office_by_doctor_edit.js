import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CenterOfficeByDoctorEdit = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [office, setOffice] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false); // Estado para saber si estamos editando

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            actions.getMedicalCenterDoctor();
            actions.getMedicalCenters();
            actions.getDoctorPanel();
        }
    }, [store.authDoctor]);

    const handleAddCenter = async (e) => {
        e.preventDefault();

        if (!selectedCenter || !office) {
            setError("Por favor, selecciona un centro médico y agrega la oficina.");
            return;
        }

        try {
            const result = await actions.addMedicalCenterDoctor(selectedCenter, office);
            if (result !== false) {
                setSelectedCenter(null);
                setOffice("");
                setError("");
                setSuccess("Centro médico y oficina agregados correctamente");

                actions.getDoctorPanel();

                setTimeout(() => {
                    setSuccess("");
                }, 3000);
            }
        } catch (error) {
            setError("Error al agregar centro médico");
        }
    };

    const handleGoToPanel = () => {
        navigate("/paneldoctor");
    };

    // Función para editar el número de oficina
    const handleEditOffice = (centerId, currentOffice) => {
        setSelectedCenter(centerId);
        setOffice(currentOffice);
        setEditing(true); // Habilitar el modo de edición
        setSuccess("");
        setError("");
    };

    // Función para actualizar el número de oficina
    const handleUpdateOffice = async (e) => {
        e.preventDefault();

        if (!office) {
            setError("Por favor, ingresa un número de oficina válido.");
            return;
        }

        try {
            const result = await actions.updateMedicalCenterDoctor(selectedCenter, office); // Llamada al PUT
            if (result !== false) {
                setSelectedCenter(null);
                setOffice("");
                setError("");
                setSuccess("Número de oficina actualizado correctamente");

                actions.getDoctorPanel(); // Actualizar los datos del doctor

                setTimeout(() => {
                    setSuccess("");
                    setEditing(false); // Desactivar el modo de edición
                }, 3000);
            }
        } catch (error) {
            setError("Error al actualizar la oficina");
        }
    };

    return (
        <div className="container">
            <h3>Centros Médicos del Doctor</h3>
            {store.doctorPanelData.doctor.medical_centers && store.doctorPanelData.doctor.medical_centers.length > 0 ? (
                <ul>
                    {store.doctorPanelData.doctor.medical_centers.map(center => (
                        <li key={center.id}>
                            {center.name} - Oficina: {center.office}
                            <button
                                className="btn btn-sm btn-warning ms-2"
                                onClick={() => handleEditOffice(center.id, center.office)}
                            >
                                Editar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tiene centros médicos asignados.</p>
            )}

            {/* Formulario para editar la oficina */}
            {editing && (
                <form onSubmit={handleUpdateOffice} className="card p-3 mt-3">
                    <div className="form-group">
                        <label htmlFor="office">Nuevo Número de Oficina</label>
                        <input
                            type="text"
                            className="form-control"
                            id="office"
                            value={office}
                            onChange={(e) => setOffice(e.target.value)}
                            placeholder="Ingrese el nuevo número de oficina"
                        />
                    </div>
                    <button type="submit" className="btn btn-success mt-3">
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="btn btn-outline-secondary ms-2"
                    >
                        Cancelar
                    </button>
                </form>
            )}

            <button onClick={handleGoToPanel} className="btn btn-primary mb-3 mt-3">
                Ir al Panel
            </button>
        </div>
    );
};
