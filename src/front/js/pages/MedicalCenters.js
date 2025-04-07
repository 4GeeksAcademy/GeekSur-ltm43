import React, { useEffect, useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";

const libraries = ["places"];

function MedicalCenters() {
  const { store, actions } = useContext(Context);
  const { medicalCenters, medicalCenterFormData, editingMedicalCenter, medicalCenterError, medicalCenterSuccessMessage } = store;
  const { getMedicalCenters, setMedicalCenterFormData, setEditingMedicalCenter, clearMedicalCenterFormData, addMedicalCenter, updateMedicalCenter, deleteMedicalCenter } = actions;

  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [center, setCenter] = React.useState({ lat: 40.749933, lng: -73.98633 });
  const [markerPosition, setMarkerPosition] = React.useState(null);
  const [image, setImage] = useState(null); // Estado para la imagen
  const [removeImage, setRemoveImage] = useState(false); // Estado para eliminar la imagen

  useEffect(() => {
    getMedicalCenters();
  }, [getMedicalCenters]);

  const onLoadMap = (map) => {
    mapRef.current = map;
  };

  const onLoadAutocomplete = (autocomplete) => {
    inputRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = inputRef.current.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      setCenter({ lat, lng });
      setMarkerPosition({ lat, lng });

      let city = "";
      let country = "";
      if (place.address_components) {
        place.address_components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            city = city || component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
      }

      setMedicalCenterFormData({
        ...medicalCenterFormData,
        name: place.name || medicalCenterFormData.name || "",
        address: place.formatted_address || medicalCenterFormData.address || "",
        city: city || medicalCenterFormData.city || "",
        country: country || medicalCenterFormData.country || "",
        latitude: lat,
        longitude: lng
      });
    }
  };

  const handleChange = (e) => {
    setMedicalCenterFormData({ ...medicalCenterFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setRemoveImage(false); // Si se selecciona una nueva imagen, desmarcar la opción de eliminar
  };

  const handleRemoveImageChange = (e) => {
    setRemoveImage(e.target.checked);
    if (e.target.checked) {
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", medicalCenterFormData.name);
      data.append("address", medicalCenterFormData.address);
      data.append("country", medicalCenterFormData.country);
      data.append("city", medicalCenterFormData.city);
      data.append("phone", medicalCenterFormData.phone);
      data.append("email", medicalCenterFormData.email);
      // Asegurarnos de que latitude y longitude se envíen como cadenas vacías si no tienen valor
      data.append("latitude", medicalCenterFormData.latitude ? medicalCenterFormData.latitude.toString() : "");
      data.append("longitude", medicalCenterFormData.longitude ? medicalCenterFormData.longitude.toString() : "");
      if (image) {
        data.append("image", image);
      }
      if (editingMedicalCenter && removeImage) {
        data.append("remove_image", "true");
      }
  
      console.log("Datos enviados al backend:");
      for (let pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
  
      if (editingMedicalCenter) {
        await updateMedicalCenter(data);
      } else {
        await addMedicalCenter(data);
      }
      setImage(null);
      setRemoveImage(false);
    } catch (error) {
      console.error("Error handling submit:", error);
      setStore({ medicalCenterError: error.message || "Error creating/updating medical center" });
    }
  };

  const handleDelete = async (id) => {
    await deleteMedicalCenter(id);
  };

  const handleEdit = (center) => {
    setEditingMedicalCenter(center);
    setMedicalCenterFormData({
      ...center,
      latitude: center.latitude || "",
      longitude: center.longitude || "",
    });

    if (center.latitude && center.longitude) {
      setCenter({ lat: center.latitude, lng: center.longitude });
      setMarkerPosition({ lat: center.latitude, lng: center.longitude });
    } else if (center.address) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: center.address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          setCenter({ lat, lng });
          setMarkerPosition({ lat, lng });

          if (!center.latitude || !center.longitude) {
            setMedicalCenterFormData((prevData) => ({
              ...prevData,
              latitude: lat,
              longitude: lng,
            }));
          }
        }
      });
    }
    setImage(null); // Limpiar el campo de la imagen al editar
    setRemoveImage(false); // Limpiar el estado de eliminar imagen
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Medical Centers</h1>

      {medicalCenterError && <div className="alert alert-danger" role="alert">{medicalCenterError}</div>}
      {medicalCenterSuccessMessage && <div className="alert alert-success" role="alert">{medicalCenterSuccessMessage}</div>}

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <div className="row">
          <div className="col-md-6">
            <div className="card p-4 mb-4 shadow-sm">
              <h4 className="mb-3">{editingMedicalCenter ? "Edit Medical Center" : "Add a Medical Center"}</h4>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group mb-3">
                  <label htmlFor="pac-input">Search Address</label>
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter a location"
                    />
                  </Autocomplete>
                </div>
                <div className="form-group mb-3">
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
                <div className="form-group mb-3">
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
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
                  <div className="col-md-6">
                    <div className="form-group mb-3">
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
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
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
                  <div className="col-md-6">
                    <div className="form-group mb-3">
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        id="latitude"
                        name="latitude"
                        placeholder="Latitude"
                        value={medicalCenterFormData.latitude || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        id="longitude"
                        name="longitude"
                        placeholder="Longitude"
                        value={medicalCenterFormData.longitude || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </div>
                {editingMedicalCenter && medicalCenterFormData.image_url && (
                  <div className="form-group mb-3">
                    <label>
                      <input
                        type="checkbox"
                        checked={removeImage}
                        onChange={handleRemoveImageChange}
                      />
                      Remove current image
                    </label>
                  </div>
                )}
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
          </div>
          <div className="col-md-6">
            <GoogleMap
              mapContainerStyle={{ height: "400px", width: "100%" }}
              center={center}
              zoom={13}
              onLoad={onLoadMap}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          </div>
        </div>
      </LoadScript>

      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Country</th>
              <th>City</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicalCenters && medicalCenters.length > 0 ? medicalCenters.map((center) => (
              <tr key={center.id}>
                <td>{center.name}</td>
                <td>{center.address}</td>
                <td>{center.country}</td>
                <td>{center.city}</td>
                <td>{center.phone}</td>
                <td>{center.email}</td>
                <td>{center.latitude || "N/A"}</td>
                <td>{center.longitude || "N/A"}</td>
                <td>
                  {center.image_url ? (
                    <img
                      src={center.image_url}
                      alt={center.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
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
            )) : <tr><td colSpan="10" className="text-center">{medicalCenterError ? "Error loading data." : "No medical centers found."}</td></tr>}
          </tbody>
        </table>
      </div>
      <Link to="/">
        <button className="btn btn-primary mt-3">Back Home</button>
      </Link>
    </div>
  );
}

export default MedicalCenters;