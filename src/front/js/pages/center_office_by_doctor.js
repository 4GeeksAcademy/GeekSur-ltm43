import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CenterOfficeByDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedCenter, setSelectedCenter] = useState(null); // Estado para el centro médico seleccionado
    const [office, setOffice] = useState(""); // Estado para la nueva oficina
    const [error, setError] = useState(""); // Manejar errores
    const [success, setSuccess] = useState(""); // Mensaje de éxito

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            actions.getMedicalCenterDoctor(); // Cargar las oficinas y centros médicos
            actions.getMedicalCenters(); // Cargar todos los centros médicos disponibles
        }
    }, [store.authDoctor]);

    const handleAddCenter = async () => {
        if (!selectedCenter || !office) {
            setError("Por favor, selecciona un centro médico y agrega la oficina.");
            return;
        }

        try {
            const result = await actions.addMedicalCenterDoctor(selectedCenter, office);
            if (result) {
                setSelectedCenter(null); // Resetear el selector
                setOffice(""); // Limpiar la oficina
                setError(""); // Limpiar error
                setSuccess("Centro médico y oficina agregados correctamente");
                setTimeout(() => {
                    setSuccess(""); // Limpiar mensaje de éxito después de 3 segundos
                }, 3000);
            }
        } catch (error) {
            setError("Error al agregar centro médico");
        }
    };

    return (
        <div className="container">
            <h3>Oficinas del Doctor</h3>

            {/* Mostrar las oficinas y centros médicos si están disponibles */}
            {store.medical_center_doctor && store.medical_center_doctor.length > 0 ? (
                <ul className="list-group">
                    {store.medical_center_doctor.map((center) => (
                        <li key={center.id} className="list-group-item">
                            Oficina: {center.office} - Centro Médico: {center.medical_center_name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tiene oficinas asignadas.</p>
            )}

            <h4 className="mt-4">Agregar Nueva Oficina</h4>

            {/* Mostrar mensajes de error */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Mostrar mensaje de éxito */}
            {success && <div className="alert alert-success">{success}</div>}

            <form>
                <div className="form-group">
                    <label htmlFor="centerSelector">Selecciona un Centro Médico</label>
                    <select
                        id="centerSelector"
                        className="form-control"
                        value={selectedCenter || ""}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        <option value="">Seleccione un centro</option>
                        {store.medicalCenters && store.medicalCenters.map((center) => (
                            <option key={center.id} value={center.id}>
                                {center.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="office">Número de Oficina</label>
                    <input
                        type="text"
                        className="form-control"
                        id="office"
                        value={office}
                        onChange={(e) => setOffice(e.target.value)}
                        placeholder="Ingrese el número de oficina"
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-success mt-3"
                    onClick={handleAddCenter}
                >
                    Agregar Oficina
                </button>
            </form>
        </div>
    );
};
