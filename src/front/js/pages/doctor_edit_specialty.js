import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const DoctorEditSpecialty = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar especialidades y datos del doctor al montar el componente
  useEffect(() => {
    if (!store.authDoctor && !localStorage.getItem("tokendoctor")) {
      navigate("/logindoctor");
    } else {
      actions.getSpecialties(); // Cargar todas las especialidades disponibles
      actions.getDoctorSpecialties(); // Cargar especialidades actuales del doctor
      actions.getDoctorPanel(); // Asegurar que los datos del doctor estén disponibles
    }
  }, [store.authDoctor]);

  // Filtrar especialidades disponibles cada vez que cambien store.specialties o store.doctorSpecialties
  useEffect(() => {
    const filteredSpecialties = store.specialties.filter(
      (specialty) =>
        !store.doctorSpecialties.some((ds) => ds.id_specialty === specialty.id)
    );
    setAvailableSpecialties(filteredSpecialties);
    console.log("Especialidades disponibles:", filteredSpecialties);
  }, [store.specialties, store.doctorSpecialties]); // Dependencias actualizadas

  // Manejar la adición de una especialidad
  const handleAddSpecialty = async () => {
    if (!selectedSpecialty) {
      setError("Por favor, selecciona una especialidad.");
      return;
    }

    try {
      const result = await actions.addSpecialtyToDoctor(selectedSpecialty);
      if (result) {
        setSuccess("Especialidad agregada correctamente");
        setSelectedSpecialty(""); // Limpiar el selector
        actions.getDoctorSpecialties(); // Actualizar la lista de especialidades del doctor
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Error al agregar la especialidad");
    }
  };

  // Manejar la eliminación de una especialidad
  const handleDeleteSpecialty = async (specialtyId) => {
    try {
      await actions.deleteDoctorSpecialty(specialtyId);
      setSuccess("Especialidad eliminada correctamente");
      actions.getDoctorSpecialties(); // Actualizar la lista
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al eliminar la especialidad");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Editar Especialidades</h1>

      {/* Mensajes de error o éxito */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Selector de especialidades */}
      <div className="form-group">
        <label htmlFor="specialtySelector">Agregar Nueva Especialidad</label>
        <select
          id="specialtySelector"
          className="form-control"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          <option value="">Selecciona una especialidad</option>
          {availableSpecialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddSpecialty}
          className="btn btn-success mt-2"
          disabled={!selectedSpecialty}
        >
          Agregar Especialidad
        </button>
      </div>

      {/* Lista de especialidades actuales */}
      <h3 className="mt-4">Especialidades Actuales</h3>
      {store.doctorSpecialties && store.doctorSpecialties.length > 0 ? (
        <ul className="list-group">
          {store.doctorSpecialties.map((specialty) => (
            <li
              key={specialty.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {specialty.name}
              <button
                onClick={() => handleDeleteSpecialty(specialty.id)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes especialidades asignadas.</p>
      )}

      {/* Botón para volver al dashboard */}
      <button
        onClick={() => navigate("/dashboarddoctor")}
        className="btn btn-primary mt-3"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};