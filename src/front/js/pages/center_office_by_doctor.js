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
            actions.getSpecialties(); // Cargar todas las especialidades disponibles
            actions.getDoctorSpecialties(); // Cargar las especialidades del doctor
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

                // Actualizar el estado del store con el nuevo centro médico y oficina
                const newMedicalCenter = store.medicalCenters.find(center => center.id === selectedCenter);
                if (newMedicalCenter) {
                    newMedicalCenter.office = office;  // Asignar la nueva oficina
                    setStore({
                        medical_center_doctor: [...store.medical_center_doctor, newMedicalCenter],
                    });
                }

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

    const [selectedSpecialty, setSelectedSpecialty] = useState(null);

    return (
        <div className="container">

            <h3>Especialidades del Doctor</h3>

            {store.doctorSpecialties && store.doctorSpecialties.length > 0 ? (
                <ul>
                    {store.doctorSpecialties.map((specialty) => (
                        <li key={specialty.id}>
                            {specialty.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tiene especialidades asignadas.</p>
            )}


            <h3>Centros Médicos</h3>
            {store.doctorPanelData.doctor.medical_centers && store.doctorPanelData.doctor.medical_centers.length > 0 ? (
                <ul>
                    {store.doctorPanelData.doctor.medical_centers.map(center => (
                        <li key={center.id}>
                            {center.name} - Oficina: {center.office}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tiene centros médicos asignados.</p>
            )}

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

                <div className="form-group mt-3">
                    <label htmlFor="specialtySelector">Selecciona una Especialidad</label>
                    <select
                        id="specialtySelector"
                        className="form-control"
                        value={selectedSpecialty || ""}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                    >
                        <option value="">Seleccione una especialidad</option>
                        {store.specialties &&
                            store.specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.id}>
                                    {specialty.name}
                                </option>
                            ))}
                    </select>
                </div>
                            




                <button type="submit" className="btn btn-success mt-3">
                    Agregar Oficina
                </button>

                <button onClick={handleGoToPanel} className="btn btn-primary mb-3 mt-3">
                    Ir al Panel
                </button>
            </form>
        </div>
    );
};
