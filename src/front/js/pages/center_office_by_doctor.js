import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CenterOfficeByDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [office, setOffice] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
    
        const result = await actions.addMedicalCenterDoctor(selectedCenter, office);
    
        if (!result.success) {
            setError(result.msg);  // Mostramos el mensaje del backend
            setTimeout(() => setError(""), 3000);
            return;
        }
    
        // Si fue exitoso
        setSelectedCenter(null);
        setOffice("");
        setError("");
        setSuccess("Centro médico y oficina agregados correctamente");
    
        actions.getDoctorPanel();
    
        setTimeout(() => setSuccess(""), 3000);
    };

    const handleGoToPanel = () => {
        navigate("/paneldoctor");
    };

    const handleGoToCMEdit = () => {
        navigate("/center_office_by_doctor_edit");
    };

    const handleDeleteCenter = async (centerId) => {
        const confirmDelete = window.confirm("¿Estás seguro que quieres eliminar este centro?");
        if (!confirmDelete) return;

        const result = await actions.deleteMedicalCenterDoctor(centerId);

        if (result) {
            setSuccess("Centro eliminado correctamente.");
            actions.getDoctorPanel(); // recargar la lista actualizada
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError("Error al eliminar el centro.");
            setTimeout(() => setError(""), 3000);
        }
    };

    return (
        <div className="container">
            <h4 className="mt-4">Agregar Nueva Oficina</h4>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleAddCenter}>
                <div className="form-group">
                    <label htmlFor="centerSelector">Selecciona un Centro Médico</label>
                    <select
                        id="centerSelector"
                        className="form-control"
                        value={selectedCenter || ""}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        <option value="">Seleccione un centro</option>
                        {store.medicalCenters &&
                            store.medicalCenters.map((center) => (
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
                <button type="submit" className="btn btn-success mt-3">
                    Agregar Oficina
                </button>

                <button onClick={handleGoToCMEdit} className="btn btn-primary mb-3 mt-3">
                    Modificar Oficina
                </button>

                <h3>Centros Médicos del Doctor</h3>

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
                                    <button
                                        className="btn btn-sm btn-danger ms-2"
                                        onClick={() => handleDeleteCenter(center.id)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p>No tiene centros médicos asignados.</p>
                )}
              
                <button onClick={handleGoToPanel} className="btn btn-primary mb-3 mt-3">
                    Ir al Panel
                </button>


                
            </form>
        </div>
    );
};
