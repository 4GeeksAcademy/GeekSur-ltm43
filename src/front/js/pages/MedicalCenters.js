import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://fictional-spoon-q7p6wrx5vx6xc956v-3001.app.github.dev/api/medical_centers";

function MedicalCenters() {
  const [centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "",
    city: "",
    phone: "",
    email: "",
  });
  const [editingCenter, setEditingCenter] = useState(null);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await axios.get(API_URL);
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching medical centers:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCenter) {
        // Actualizar centro existente
        await axios.put(`${API_URL}/${editingCenter.id}`, formData);
        setCenters(
          centers.map((center) =>
            center.id === editingCenter.id ? { ...center, ...formData } : center
          )
        );
        setEditingCenter(null);
      } else {
        // Agregar nuevo centro
        const response = await axios.post(API_URL, formData);
        setCenters([...centers, response.data]);
      }
      setFormData({ name: "", address: "", country: "", city: "", phone: "", email: "" });
    } catch (error) {
      console.error("Error adding/updating medical center:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCenters(centers.filter((center) => center.id !== id));
    } catch (error) {
      console.error("Error deleting medical center:", error);
    }
  };

  const handleEdit = (center) => {
    setEditingCenter(center);
    setFormData(center);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Centers</h1>

      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">Add a Medical Center</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            {editingCenter ? "Update Medical Center" : "Add Medical Center"}
          </button>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Country</th>
              <th>City</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.length > 0 ? (
              centers.map((center) => (
                <tr key={center.id}>
                  <td>{center.name}</td>
                  <td>{center.address}</td>
                  <td>{center.country}</td>
                  <td>{center.city}</td>
                  <td>{center.phone}</td>
                  <td>{center.email}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(center)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(center.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No medical centers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedicalCenters;