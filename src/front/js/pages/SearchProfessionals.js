import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchProfessionals() {
  const { store, actions } = useContext(Context);
  const { medicalCenterLocations, specialties } = store;
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    actions.getMedicalCenterLocations();
    actions.getSpecialties();
  }, [actions]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await actions.searchDoctors(selectedSpecialty, selectedLocation, selectedCity);
      setSearchResults(results);
    } catch (err) {
      setError("Error al buscar profesionales. Inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleSpecialtyChange = (e) => setSelectedSpecialty(e.target.value);
  const handleCityChange = (e) => setSelectedCity(e.target.value);

  const uniqueCountries = medicalCenterLocations
    ? [...new Set(medicalCenterLocations.map((location) => location.country))]
    : [];

  const uniqueCities = selectedLocation
    ? [
        ...new Set(
          medicalCenterLocations
            .filter((location) => location.country === selectedLocation)
            .map((location) => location.city)
        ),
      ]
    : [];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4" style={{ color: "#007bff" }}>
        Buscar Profesionales
      </h1>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select className="form-control" value={selectedLocation} onChange={handleLocationChange}>
            <option value="">Selecciona un País</option>
            {uniqueCountries.length > 0 ? (
              uniqueCountries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))
            ) : (
              <option value="">Cargando países...</option>
            )}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select className="form-control" value={selectedSpecialty} onChange={handleSpecialtyChange}>
            <option value="">Selecciona una Especialidad</option>
            {specialties && specialties.length > 0 ? (
              specialties.map((specialty, index) => (
                <option key={index} value={specialty.name}>
                  {specialty.name}
                </option>
              ))
            ) : (
              <option value="">Cargando especialidades...</option>
            )}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-control"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedLocation}
          >
            <option value="">Selecciona una Ciudad</option>
            {uniqueCities.length > 0 ? (
              uniqueCities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))
            ) : (
              <option value="">No hay ciudades disponibles</option>
            )}
          </select>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? <span>Buscando...</span> : <><FaSearch /> Buscar</>}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* RESULTADOS EN TARJETAS */}
      <div className="row mt-4">
        {searchResults.length > 0 ? (
          searchResults.map((doctor) => (
            <div key={doctor.id} className="col-md-12 mb-4">
              <div className="card shadow-sm border rounded p-3">
                <div className="d-flex align-items-center">
                  <img
                    src="https://via.placeholder.com/80"
                    alt="doctor"
                    className="rounded-circle mr-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">
                      {doctor.first_name} {doctor.last_name}
                    </h5>
                    <p className="mb-1 text-muted">
                      {doctor.specialties.map((spec) => spec.name).join(", ")}
                    </p>
                    <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
                      {doctor.medical_centers.map((center) => center.name).join(", ")} –{" "}
                      {doctor.medical_centers.map((center) => center.city).join(", ")},{" "}
                      {doctor.medical_centers.map((center) => center.country).join(", ")}
                    </p>
                    <p className="mb-0" style={{ fontSize: "0.9rem" }}>
                      Tel: {doctor.phone_number} | Email: {doctor.email}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <button className="btn btn-outline-success">Ver Perfil del Profesional</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchProfessionals;
