import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

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
        navigate(`/doctor/${doctorId}/${specialtyId}`);
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '960px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>logo</div>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex' }}>
                        <li style={{ marginLeft: '15px' }}>
                            <a href="/cuenta" style={{ textDecoration: 'none', color: '#333' }}>Cuenta</a>
                        </li>
                        <li style={{ marginLeft: '15px' }}>
                            <a href="/salir" style={{ textDecoration: 'none', color: '#333' }}>Salir</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main style={{ padding: '10px 0' }}>
                <section style={{ marginBottom: '20px', padding: '20px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <h2>Buscar Profesional</h2>
                    <div>
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Nombre del profesional o especialidad"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                        <select name="specialty" value={selectedSpecialty} onChange={handleInputChange}>
                            <option value="">Especialidades</option>
                            {store.specialties && store.specialties.map((specialty, index) => (
                                <option key={index} value={specialty.name}>{specialty.name}</option>
                            ))}
                        </select>
                        <select name="location" value={selectedLocation} onChange={handleInputChange}>
                            <option value="">Ubicación</option>
                            <option value="buenos-aires">Buenos Aires</option>
                            <option value="cordoba">Córdoba</option>
                        </select>
                        <button onClick={handleSearch} disabled={loading}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </section>

                <section>
                    <h2>Resultados de la Búsqueda</h2>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {loading && !error && <div style={{ fontStyle: 'italic' }}></div>}
                    {searchResults.length > 0 ? (
                        <div>
                            {searchResults.map((professional) => (
                                <div key={professional.id}>
                                    <h3>{professional.info_doctor.first_name}</h3>
                                    <p>Especialidades: {professional.specialty_name}</p>
                                    <button onClick={() => handleViewProfile(professional.info_doctor.id, professional.id_specialty)}>Ver Perfil</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p>Sin resultados encontrados.</p>
                    )}
                </section>
            </main>
        </div>
    );
}

export default SearchProfessionals;