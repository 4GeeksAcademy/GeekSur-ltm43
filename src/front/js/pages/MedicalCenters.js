import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext"; // Make sure the path is correct
import "bootstrap/dist/css/bootstrap.min.css";


function MedicalCenters() {
  const { store, actions } = useContext(Context);
  const { medicalCenters, medicalCenterFormData, editingMedicalCenter, medicalCenterError, medicalCenterSuccessMessage } = store;
  const { getMedicalCenters, setMedicalCenterFormData, setEditingMedicalCenter, clearMedicalCenterFormData, addMedicalCenter, updateMedicalCenter, deleteMedicalCenter } = actions;

  useEffect(() => {
    getMedicalCenters();
  }, [getMedicalCenters]);

  const handleChange = (e) => {
    setMedicalCenterFormData({ ...medicalCenterFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicalCenter) {
        await updateMedicalCenter();
      } else {
        await addMedicalCenter();
      }
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteMedicalCenter(id);
  };

  const handleEdit = (center) => {
    setEditingMedicalCenter(center);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Centers</h1>

      {medicalCenterError && <div className="alert alert-danger" role="alert">{medicalCenterError}</div>}
      {medicalCenterSuccessMessage && <div className="alert alert-success" role="alert">{medicalCenterSuccessMessage}</div>}

      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">{editingMedicalCenter ? "Edit Medical Center" : "Add a Medical Center"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={medicalCenterFormData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={medicalCenterFormData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={medicalCenterFormData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={medicalCenterFormData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={medicalCenterFormData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={medicalCenterFormData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            {editingMedicalCenter ? "Update Medical Center" : "Add Medical Center"}
          </button>
          {editingMedicalCenter && (
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => clearMedicalCenterFormData()}
            >
              Cancel Edit
            </button>
          )}
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
            {medicalCenters && medicalCenters.length > 0 ? (
              medicalCenters.map((center) => (
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
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(center.id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {medicalCenterError ? 'Error loading data.' : 'No medical centers found.'}
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