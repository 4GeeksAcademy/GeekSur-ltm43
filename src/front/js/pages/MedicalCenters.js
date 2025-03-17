import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/medical_centers";

function MedicalCenters() {
  const [centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({ name: "", address: "", country: "", city: "", phone: "", email: "" });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    const response = await axios.get(API_URL);
    setCenters(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData);
      setCenters([...centers, response.data]); // Agrega el nuevo centro al estado
      setFormData({ name: "", address: "", country: "", city: "", phone: "", email: "" }); // Limpia el formulario
    } catch (error) {
      console.error("Error adding medical center:", error);
    }
  };

  return (
    <div>
      <h1>Medical Centers</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <button type="submit">Add Medical Center</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Country</th>
            <th>City</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {centers.map((center) => (
            <tr key={center.id}>
              <td>{center.name}</td>
              <td>{center.address}</td>
              <td>{center.country}</td>
              <td>{center.city}</td>
              <td>{center.phone}</td>
              <td>{center.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicalCenters;