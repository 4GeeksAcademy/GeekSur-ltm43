import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const DoctorEditSpecialty = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [newSpecialty, setNewSpecialty] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            actions.getSpecialties(); // Cargar todas las especialidades disponibles
            actions.getDoctorSpecialties(); // Cargar las especialidades del doctor
        }
    }, [store.authDoctor]);

    useEffect(() => {
        console.log("Especialidades del doctor:", store.doctorSpecialties);
        if (store.doctorSpecialties) {
            setSelectedSpecialties(store.doctorSpecialties.map(s => s.id)); // Guardar los IDs de las especialidades del doctor
        }
    }, [store.doctorSpecialties]);

    // Manejar la selección de especialidades
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const specialtyId = parseInt(value);

        if (checked) {
            setSelectedSpecialties([...selectedSpecialties, specialtyId]);
        } else {
            setSelectedSpecialties(selectedSpecialties.filter(id => id !== specialtyId));
        }
    };

    // Manejar eliminación de especialidad
    const handleDeleteSpecialty = async (specialtyId) => {
        try {
            await actions.deleteDoctorSpecialty(specialtyId);
            setSelectedSpecialties(selectedSpecialties.filter(id => id !== specialtyId));
            setSuccessMessage("Especialidad eliminada correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError("Error al eliminar la especialidad");
        }
    };

    // Guardar las especialidades seleccionadas
    const handleSaveSpecialties = async () => {
        try {
            await actions.updateDoctorSpecialties(selectedSpecialties);
            setSuccessMessage("Especialidades guardadas correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setError("Error al guardar las especialidades");
        }
    };


    

    return (
        <div className="container">
            <h3>Especialidades del Doctor</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <ul className="list-group">
                {store.doctorSpecialties && store.doctorSpecialties.length > 0 ? (
                    store.doctorSpecialties.map((specialty) => (
                        <li key={specialty.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {specialty.name}
                            <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteSpecialty(specialty.id)}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No tiene especialidades asignadas.</p>
                )}
            </ul>

            <h4 className="mt-4">Agregar Nueva Especialidad</h4>
            <form>
                {store.specialties.map((specialty) => (
                    <div key={specialty.id} className="form-check">
                        <input
                            type="checkbox"
                            id={`specialty-${specialty.id}`}
                            value={specialty.id}
                            checked={selectedSpecialties.includes(specialty.id)}
                            onChange={handleCheckboxChange}
                            className="form-check-input"
                        />
                        <label htmlFor={`specialty-${specialty.id}`} className="form-check-label">
                            {specialty.name}
                        </label>
                    </div>
                ))}
                <button 
                    type="button" 
                    className="btn btn-success mt-3" 
                    onClick={handleSaveSpecialties}
                >
                    Guardar Cambios
                </button>
            </form>

            <button 
                onClick={() => navigate("/paneldoctor")} 
                className="btn btn-primary mt-3"
            >
                Volver al Panel
            </button>
        </div>
    );
};
