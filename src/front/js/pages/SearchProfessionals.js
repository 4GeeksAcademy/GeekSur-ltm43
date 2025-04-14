import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";
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
    const navigate = useNavigate();
    const location = useLocation();
    
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        actions.getMedicalCenterLocations();
        actions.getSpecialties();
        
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        }
    }, []);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const patient = store.currentPatient;
    const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Paciente";
    const patientLocation = patient?.city ? `${patient.city}, ${patient.country || 'CA'}` : "San Francisco, CA";

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

    const uniqueCountries = medicalCenterLocations ? [...new Set(medicalCenterLocations.map(location => location.country))] : [];

    const uniqueCities = selectedLocation
        ? [...new Set(
            medicalCenterLocations
                .filter((location) => location.country === selectedLocation)
                .map((location) => location.city)
        )]
        : [];

    const handleScheduleClick = (doctorId) => {
        const token = localStorage.getItem('tokenpatient');
        const selectedSpecialtyObj = specialties.find(
            (spec) => spec.name === selectedSpecialty
        );
        const specialtyId = selectedSpecialtyObj ? selectedSpecialtyObj.id : null;
    
        if (!specialtyId) {
            alert("Error: No se encontró el ID de la especialidad.");
            return;
        }
    
        if (token && token !== "") {
            navigate(`/agendar-turno/${doctorId}/${specialtyId}`);
        } else {
            navigate('/loginpatient');
        }
    };

    return (
        <>
            {store.authPatient || localStorage.getItem("tokenpatient") ? (
                <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
                    {/* Sidebar fijo */}
                    <div
                        className="d-flex flex-column flex-shrink-0 py-3 text-white"
                        style={{
                            width: "280px",
                            backgroundColor: "rgb(100, 191, 208)",
                            position: "fixed",
                            height: "100vh",
                            overflowY: "auto",
                        }}
                    >
                        <a
                            href="/dashboardpatient"
                            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
                        >
                            <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
                        </a>
                        <hr />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <Link
                                    to="/dashboardpatient"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/dashboardpatient" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-house-door me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/panelpatient"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/panelpatient" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Mi Perfil
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/patient-appointments"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/patient-appointments" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-calendar-check me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Mis Citas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/search-professionals"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/search-professionals" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-search me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Buscar Profesional
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ai-consultation"
                                    className={`nav-link text-white d-flex align-items-center ${
                                        location.pathname === "/ai-consultation" ? "active" : ""
                                    }`}
                                    style={{
                                        padding: "10px 0",
                                        margin: "0 -15px",
                                        borderRadius: "0",
                                    }}
                                >
                                    <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                                    Habla Con Boti IA
                                </Link>
                            </li>
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn d-flex align-items-center"
                            style={{
                                backgroundColor: "#97dbe7",
                                color: "#000",
                                minWidth: "100px",
                                whiteSpace: "nowrap",
                                padding: "10px",
                                borderRadius: "5px",
                                fontWeight: "500",
                                whiteSpace: "nowrap",
                                width: "fit-content",
                                maxWidth: "100%",
                                margin: "0 auto",
                            }}
                        >
                            <i className="bi bi-box-arrow-right me-2 fs-5"></i>
                            Cerrar Sesión
                        </button>
                    </div>

                    {/* Contenido principal */}
                    <div
                        className="flex-grow-1 p-4"
                        style={{
                            backgroundColor: "#f0faff",
                            color: "#000",
                            marginLeft: "280px",
                        }}
                    >
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2>Buscar Profesionales</h2>
                                <p className="text-muted">Encuentra especialistas médicos cerca de ti</p>
                            </div>
                            <div className="d-flex align-items-center position-relative">
                                <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {patientLocation} - {currentTime}
                                </span>
                                {patient ? (
                                    patient.url ? (
                                        <div>
                                            <img
                                                src={patient.url}
                                                alt="Foto de perfil"
                                                onClick={() => setShowDropdown(!showDropdown)}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    border: "2px solid #97dbe7",
                                                    cursor: "pointer",
                                                }}
                                            />
                                            {showDropdown && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "50px",
                                                        right: "0",
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #dee2e6",
                                                        borderRadius: "5px",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <button
                                                        onClick={handleLogout}
                                                        className="btn d-flex align-items-center"
                                                        style={{
                                                            padding: "10px 20px",
                                                            color: "#000",
                                                            border: "none",
                                                            background: "none",
                                                            width: "100%",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <i className="bi bi-box-arrow-right me-2"></i>
                                                        Cerrar Sesión
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "#97dbe7",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            {patientName.charAt(0).toUpperCase()}
                                            {showDropdown && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "50px",
                                                        right: "0",
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #dee2e6",
                                                        borderRadius: "5px",
                                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <button
                                                        onClick={handleLogout}
                                                        className="btn d-flex align-items-center"
                                                        style={{
                                                            padding: "10px 20px",
                                                            color: "#000",
                                                            border: "none",
                                                            background: "none",
                                                            width: "100%",
                                                            textAlign: "left",
                                                        }}
                                                    >
                                                        <i className="bi bi-box-arrow-right me-2"></i>
                                                        Cerrar Sesión
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>

                        {/* Filtros de búsqueda */}
                        <div className="card shadow-sm mb-4" style={{ 
                            backgroundColor: "#f8f9fa", 
                            border: "1px solid #dee2e6",
                            borderRadius: "10px",
                            padding: "20px"
                        }}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <select
                                        className="form-control"
                                        value={selectedLocation}
                                        onChange={handleLocationChange}
                                        style={{ border: "1px solid #000" }}
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

                                <div className="col-md-4 mb-3">
                                    <select
                                        className="form-control"
                                        value={selectedSpecialty}
                                        onChange={handleSpecialtyChange}
                                        style={{ border: "1px solid #000" }}
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

                                <div className="col-md-4 mb-3">
                                    <select
                                        className="form-control"
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        disabled={!selectedLocation}
                                        style={{ border: "1px solid #000" }}
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

                            <div className="text-center">
                                <button
                                    className="btn"
                                    onClick={handleSearch}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: "#97dbe7",
                                        color: "#000",
                                        minWidth: "100px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {loading ? "Buscando..." : <><FaSearch className="me-2" /> Buscar</>}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger mb-4">
                                {error}
                            </div>
                        )}

                        {/* Resultados */}
                        {searchResults.length > 0 ? (
                            <div className="card shadow-sm" style={{ 
                                backgroundColor: "#f8f9fa", 
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                                padding: "20px"
                            }}>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Especialidad</th>
                                                <th>Centro Médico</th>
                                                <th>Ciudad</th>
                                                <th>País</th>
                                                <th>Teléfono</th>
                                                <th>Email</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchResults.map((doctor) => (
                                                <tr key={doctor.id}>
                                                    <td>{doctor.first_name} {doctor.last_name}</td>
                                                    <td>{doctor.specialties.map((spec) => spec.name).join(", ")}</td>
                                                    <td>{doctor.medical_centers.map((center) => center.name).join(", ")}</td>
                                                    <td>{doctor.medical_centers.map((center) => center.city).join(", ")}</td>
                                                    <td>{doctor.medical_centers.map((center) => center.country).join(", ")}</td>
                                                    <td>{doctor.phone_number}</td>
                                                    <td>{doctor.email}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleScheduleClick(doctor.id)}
                                                            style={{ 
                                                                backgroundColor: "#97dbe7", 
                                                                color: "#000",
                                                                border: "1px solid #000",
                                                                width: "100%"
                                                            }}
                                                        >
                                                            Agendar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm text-center" style={{ 
                                backgroundColor: "#f8f9fa", 
                                border: "1px solid #dee2e6",
                                borderRadius: "10px",
                                padding: "40px"
                            }}>
                                <p>No se encontraron resultados. Realiza una búsqueda para encontrar profesionales.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Navigate to="/loginpatient" />
            )}

            {/* Estilos CSS */}
            <style>{`
                .nav-link.active {
                    background-color: #f0faff !important;
                    color: #000 !important;
                }
            `}</style>
        </>
    );
}

export default SearchProfessionals;