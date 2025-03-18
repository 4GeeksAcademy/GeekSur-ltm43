import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Patients = () => {
  const { store, actions } = useContext(Context);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    password: "",
  });
  const [editId, setEditId] = useState(null);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    actions.getPatients();
  }, [actions]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Actualizar paciente
        await actions.updatePatient(editId, formData);
        setEditId(null);
      } else {
        // Crear paciente
        await actions.createPatient(formData);
      }
      // Limpiar formulario
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        password: "",
      });
      // Actualizar lista de pacientes
      actions.getPatients();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Manejar edición
  const handleEdit = (patient) => {
    setFormData({
      email: patient.email,
      first_name: patient.first_name,
      last_name: patient.last_name,
      gender: patient.gender,
      birth_date: patient.birth_date,
      phone_number: patient.phone_number,
      password: "", // No se carga la contraseña por seguridad
    });
    setEditId(patient.id);
  };

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este paciente?")) {
      try {
        await actions.deletePatient(id);
        // Actualizar lista de pacientes
        actions.getPatients();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  console.log("Pacientes en el store:", store.patients);
  return (
    <div className="container">
      <h1>{editId ? "Editar Paciente" : "Crear Paciente"}</h1>
      {/* Formulario para crear/editar pacientes */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Género:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Selecciona</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
          </select>
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editId ? "Actualizar" : "Crear"} Paciente</button>
        {editId && (
          <button type="button" onClick={() => setEditId(null)}>
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Lista de pacientes */}
      <h2>Lista de Pacientes</h2>
      <ul>
        {store.patients.map((patient) => (
          <li key={patient.id}>
            {patient.first_name} {patient.last_name} ({patient.email})
            <button onClick={() => handleEdit(patient)}>Editar</button>
            <button onClick={() => handleDelete(patient.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <br />
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};