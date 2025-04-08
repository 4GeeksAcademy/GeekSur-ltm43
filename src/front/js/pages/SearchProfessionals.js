import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";

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
    actions.getSpecialties();  // Asegúrate de cargar las especialidades desde el backend si es necesario
  }, [actions]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${process.env.BACKEND_URL}/api/professionals/search?country=${selectedLocation}`;

      if (selectedSpecialty) {
        url += `&specialty=${selectedSpecialty}`;
      }

      if (selectedCity) {
        url += `&city=${selectedCity}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error de red");
      }

      const data = await response.json();
      if (response.status === 200) {
        setSearchResults(data.doctors);
      }
    } catch (err) {
      setError("Hubo un error al buscar los resultados.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Eliminar duplicados de países
  const uniqueCountries = medicalCenterLocations ? [...new Set(medicalCenterLocations.map(location => location.country))] : [];

  const uniqueCities = selectedLocation
  ? [...new Set(
      medicalCenterLocations
        .filter((location) => location.country === selectedLocation)
        .map((location) => location.city)
    )]
  : [];

  return (
    <div className="container mt-4">

      <h1 className="text-center mb-4">Buscar Profesionales</h1>

      <div className="row">
        
        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
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

        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
          >
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

        <div className="col-md-4">
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
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <span>Buscando...</span> : <FaSearch />} Buscar
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="table-responsive mt-4">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Centro Médico</th>
              <th>Ciudad</th>
              <th>País</th>
              <th>Teléfono</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.first_name} {doctor.last_name}</td>
                  <td>{doctor.specialties.map((spec) => spec.name).join(", ")}</td>
                  <td>{doctor.medical_centers.map((center) => center.name).join(", ")}</td>
                  <td>{doctor.medical_centers.map((center) => center.city).join(", ")}</td>
                  <td>{doctor.medical_centers.map((center) => center.country).join(", ")}</td>
                  <td>{doctor.phone_number}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchProfessionals;
