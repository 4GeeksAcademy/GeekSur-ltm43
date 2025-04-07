import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const SpecialtyByDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [editMode, setEditMode] = useState(false);  // Estado para habilitar la edición
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
            navigate("/logindoctor");
        } else {
            actions.getSpecialties(); // Cargar todas las especialidades disponibles
    
            actions.getDoctorSpecialties().then((doctorSpecialties) => {
                if (doctorSpecialties.length > 0) {
                    console.log("Especialidades cargadas:", doctorSpecialties); // 👀 Debug
                    setSelectedSpecialties(doctorSpecialties.map((s) => s.name)); 
                }
            });
        }
    }, [store.authDoctor]);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedSpecialties([...selectedSpecialties, value]);
        } else {
            setSelectedSpecialties(selectedSpecialties.filter((s) => s !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.setSelectedSpecialties(selectedSpecialties); // Guardar en el store
        navigate("/center_office_by_doctor"); // Redirigir al siguiente paso
    };

    // Función para confirmar y guardar las especialidades seleccionadas al backend
    const handleSaveSpecialties = async () => {
        try {
            console.log("Especialidades seleccionadas antes de guardar:", selectedSpecialties);
    
            for (let specialty of selectedSpecialties) {
                const specialtyData = store.specialties.find(s => s.name === specialty);
                console.log("Especialidad encontrada:", specialtyData);
    
                if (!specialtyData) {
                    console.error(`No se encontró la especialidad: ${specialty}`);
                    continue; // Salta a la siguiente iteración si no encuentra la especialidad
                }
    
                const response = await actions.addSpecialtyToDoctor(specialtyData.id);
                console.log("Respuesta del backend:", response);
            }
    
            setSuccessMessage("Especialidades guardadas correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
            setEditMode(false);
        } catch (error) {
            console.error("Error al guardar:", error);
            setError("Error al guardar las especialidades: " + error.message);
        }
    };

    // Función para habilitar el modo de edición
    const handleEdit = () => {
        setEditMode(true);
    };

    // Función para confirmar la selección y redirigir
    const handleConfirmAndContinue = () => {
        if (selectedSpecialties.length > 0) {
            actions.setSelectedSpecialties(selectedSpecialties); // Guardar en el store
            navigate("/center_office_by_doctor"); // Redirigir al siguiente paso
        } else {
            setError("Por favor, seleccione al menos una especialidad.");
        }
    };

    return (
        <div className="container">
            <h3>Seleccione una o más especialidades:</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    {store.specialties.map((specialty) => (
                        <div key={specialty.id}>
                            <input
                                type="checkbox"
                                id={`specialty-${specialty.id}`}
                                value={specialty.name}
                                checked={selectedSpecialties.includes(specialty.name)}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor={`specialty-${specialty.id}`}>{specialty.name}</label>
                        </div>
                    ))}
                </div>

                <h4>Especialidades Seleccionadas:</h4>
                {selectedSpecialties.length > 0 ? (
                    <ul>
                        {selectedSpecialties.map((s, index) => <li key={index}>{s}</li>)}
                    </ul>
                ) : (
                    <p>Favor escoger al menos una especialidad</p>
                )}

                {/* Botón para Editar especialidades */}
                {!editMode && (
                    <button type="button" onClick={handleEdit} className="btn btn-primary mt-3">
                        Editar Especialidades
                    </button>
                )}

                {/* Mostrar botones dependiendo del estado de edición */}
                {editMode ? (
                    <div className="d-flex gap-2 mt-3">
                        <button type="button" onClick={handleSaveSpecialties} className="btn btn-success">
                            Guardar Especialidades
                        </button>
                    </div>
                ) : (
                    <div className="d-flex gap-2 mt-3">
                        <button 
                            type="button" 
                            onClick={() => {
                                handleConfirmAndContinue();
                                handleSaveSpecialties();
                            }} 
                            className="btn btn-primary"
                        >
                            Confirmar y continuar
                        </button>
                    </div>



                )}
            </form>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}

            <br />
            <Link to="/dashboarddoctor">
                <button type="submit" className="btn btn-primary">DashBoard</button>
            </Link>
        </div>
    );
};
