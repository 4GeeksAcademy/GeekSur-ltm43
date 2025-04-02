import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

function SearchProfessionals() {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSpecialties() {
            try {
                await actions.getSpecialties();
                if (isMounted) {
                    console.log("Especialidades cargadas:", store.specialties);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error cargando especialidades:", err);
                    setError("Error al cargar las especialidades.");
                }
            }
        }

        fetchSpecialties();

        return () => {
            setIsMounted(false);
        };
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        const searchCriteria = {
            name: searchTerm,
            specialty: selectedSpecialty,
            city: selectedLocation,
            country: 'Argentina'
        };

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/search-doctor', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchCriteria),
            });

            console.log("Criterios de búsqueda:", searchCriteria);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (response.status === 200) {
                console.log("Resultados de la búsqueda:", data);
                setSearchResults(data.results);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'searchTerm':
                setSearchTerm(value);
                break;
            case 'specialty':
                setSelectedSpecialty(value);
                break;
            case 'location':
                setSelectedLocation(value);
                break;
            default:
                break;
        }
    };

    const handleViewProfile = (doctorId, specialtyId) => {
        if (doctorId && specialtyId) {
            navigate(`/doctor/${doctorId}/${specialtyId}`);
        } else {
            console.error("doctorId o specialtyId no están disponibles");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            backgroundColor: 'rgb(225 250 255)' 
        }}>
            <div style={{ 
                backgroundColor: 'rgb(152 210 237)', 
                padding: '40px', 
                borderRadius: '10px', 
                width: '90%', 
                maxWidth: '100%', 
                textAlign: 'left' 
            }}>
                <h1 style={{ color: 'white', marginBottom: '30px', textAlign: 'center' }}>Buscar Profesional</h1>
                <section style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Nombre del profesional o especialidad"
                            value={searchTerm}
                            onChange={handleInputChange}
                            style={{ padding: '10px', marginRight: '10px', border: 'none', borderRadius: '5px', flex: '1' }}
                        />
                        <select name="specialty" value={selectedSpecialty} onChange={handleInputChange} style={{ padding: '10px', marginRight: '10px', border: 'none', borderRadius: '5px', flex: '1' }}>
                            <option value="">Especialidades</option>
                            {store.specialties && store.specialties.map((specialty, index) => (
                                <option key={index} value={specialty.name}>{specialty.name}</option>
                            ))}
                        </select>
                        <select name="location" value={selectedLocation} onChange={handleInputChange} style={{ padding: '10px', marginRight: '10px', border: 'none', borderRadius: '5px', flex: '1' }}>
                            <option value="">Ubicación</option>
                            <option value="buenos-aires">Buenos Aires</option>
                            <option value="cordoba">Córdoba</option>
                        </select>
                        <button 
                            onClick={handleSearch} 
                            disabled={loading} 
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: 'rgb(93 177 212)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                flex: '0.5',
                                display: 'flex', // Para alinear el icono y el texto
                                alignItems: 'center', // Centrar verticalmente
                                justifyContent: 'center' // Centrar horizontalmente
                            }}
                        >
                            {loading ? <span style={{ marginRight: '8px' }}>Buscando...</span> : <FaSearch />}
                        </button>
                    </div>
                </section>

                <section>
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>Resultados de la Búsqueda</h2>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {loading && !error && <div style={{ fontStyle: 'italic', color: 'white' }}>Cargando...</div>}
                    {searchResults.length > 0 ? (
                        <div>
                            {searchResults.map((professional) => (
                                <div key={professional.id} style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '10px' }}>
                                    <h3 style={{ color: '#333' }}>{professional.info_doctor.first_name}</h3>
                                    <p style={{ color: '#555' }}>Especialidades: {professional.specialty_name}</p>
                                    <button onClick={() => handleViewProfile(professional.info_doctor.id, professional.id_specialty)} style={{ padding: '8px 16px', backgroundColor: 'rgb(93 177 212)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ver Perfil</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p style={{ color: 'white' }}>Sin resultados encontrados.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default SearchProfessionals;