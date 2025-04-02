import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const SignupPatient = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    birth_date: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actions.createPatient(formData);
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        gender: "",
        birth_date: "",
        phone_number: "",
        password: "",
      });
      alert("Paciente registrado exitosamente");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Registro de Paciente</h1>
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
        <button type="submit">Registrar Paciente</button>
      </form>
      <br />
      <Link to="/">
        <button className="btn btn-primary">Volver al inicio</button>
      </Link>
    </div>
  );
};
