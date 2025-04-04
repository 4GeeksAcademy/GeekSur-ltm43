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
    historial_clinico: ""  // Nuevo campo
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    actions.getPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await actions.updatePatient(editId, formData);
        setEditId(null);
      } else {
        await actions.createPatient(formData);
      }
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        password: "",
        historial_clinico: ""  // Limpiar el nuevo campo
      });
      actions.getPatients();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      email: patient.email,
      first_name: patient.first_name,
      last_name: patient.last_name,
      gender: patient.gender,
      birth_date: patient.birth_date,
      phone_number: patient.phone_number,
      password: "", // No se carga la contraseña por seguridad
      historial_clinico: patient.historial_clinico || ""  // Cargar historial clínico
    });
    setEditId(patient.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este paciente?")) {
      try {
        await actions.deletePatient(id);
        actions.getPatients();
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="container">
      <h1>{editId ? "Editar Paciente" : "Crear Paciente"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
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
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Historial Clínico:</label>
          <textarea
            name="historial_clinico"
            value={formData.historial_clinico}
            onChange={handleChange}
            placeholder="Historial Clínico (opcional)"
            style={{ height: '100px' }}
          />
        </div>
        <button type="submit">{editId ? "Actualizar" : "Crear"} Paciente</button>
        {editId && (
          <button type="button" onClick={() => setEditId(null)}>
            Cancelar Edición
          </button>
        )}
      </form>

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