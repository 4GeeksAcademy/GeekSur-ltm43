import React, { useEffect, useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import "../../styles/home.css";

const libraries = ["places"];

function MedicalCenters() {
    const { store, actions } = useContext(Context);
    const { medicalCenters, medicalCenterError, medicalCenterSuccessMessage } = store;
    const { getMedicalCenters } = actions;

    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const [center, setCenter] = useState({ lat: 40.749933, lng: -73.98633 });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        //console.log("Iniciando carga de centros médicos...");
        getMedicalCenters()
            .then(() => {
                //console.log("Centros médicos cargados:", medicalCenters);
                if (medicalCenters.length > 0) {
                    adjustMapBounds(medicalCenters);
                }
                setIsLoading(false);
            })
            .catch(error => {
                //console.error("Error al obtener centros médicos:", error);
                setIsLoading(false);
            });
    }, [getMedicalCenters]);
    

    const onLoadMap = (map) => {
        mapRef.current = map;
        //console.log("Mapa cargado, ajustando bounds...");
        adjustMapBounds(medicalCenters);
    };

    const adjustMapBounds = (centers) => {
        if (centers.length > 0 && mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasValidCoords = false;

            centers.forEach(center => {
                if (center.latitude && center.longitude) {
                   // console.log(`Añadiendo marcador para ${center.name} en (${center.latitude}, ${center.longitude})`);
                    bounds.extend({ lat: parseFloat(center.latitude), lng: parseFloat(center.longitude) });
                    hasValidCoords = true;
                } else {
                    console.warn(`No hay coordenadas para ${center.name}`);
                }
            });

            if (hasValidCoords) {
               // console.log("Ajustando bounds del mapa...");
                mapRef.current.fitBounds(bounds);
            } else {
                console.warn("No hay coordenadas válidas para ajustar el mapa.");
                setCenter({ lat: 40.749933, lng: -73.98633 });
            }
        } else {
            console.warn("No hay centros para ajustar el mapa.");
        }
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
            //console.log("Ubicación seleccionada:", { lat, lng });
        } else {
            console.log("No se pudo obtener la geometría de la ubicación ingresada.");
        }
    };

    const scroll = (scrollOffset) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += scrollOffset;
        } else {
            console.warn("containerRef.current is null.");
        }
    };

    return (
        <div className="home-container">
            {/* Sección Hero */}
            <section
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${require('../../img/backgroundImage.jpg')})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    padding: '50px 20px',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <div className="hero-content">
                    <h1 style={{ color: '#1ca9bb' }}>Nuestros Centros Médicos</h1>
                    <p style={{ color: '#1ca9bb' }}>Encuentra información sobre nuestros centros médicos.</p>
                </div>
            </section>

            {/* Sección de Mapa y Autocomplete */}
            <section style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
                <div className="container">
                    <h2 style={{ color: '#1ca9bb', textAlign: 'center', marginBottom: '30px' }}>
                        Busca tu Ubicación
                    </h2>
                    {isLoading ? (
                        <p style={{ textAlign: 'center' }}>Cargando mapa...</p>
                    ) : medicalCenterError ? (
                        <div className="alert alert-danger">{medicalCenterError}</div>
                    ) : (
                        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm" style={{ backgroundColor: '#9de3f0', border: 'none' }}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="pac-input" style={{ color: '#1ca9bb' }}>Ingresa tu dirección</label>
                                            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Ingresa una ubicación"
                                                    style={{ padding: '10px', borderRadius: '5px' }}
                                                />
                                            </Autocomplete>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                    <GoogleMap
                                        mapContainerStyle={{ height: "400px", width: "100%", borderRadius: '10px' }}
                                        center={center}
                                        zoom={2}
                                        onLoad={onLoadMap}
                                    >
                                        {markerPosition && (
                                            <Marker
                                                position={markerPosition}
                                                icon={{
                                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                                    scaledSize: new window.google.maps.Size(32, 32),
                                                }}
                                            />
                                        )}
                                        {medicalCenters.map(center => (
                                            center.latitude && center.longitude ? (
                                                <Marker
                                                    key={center.id}
                                                    position={{ lat: parseFloat(center.latitude), lng: parseFloat(center.longitude) }}
                                                    label={center.name}
                                                    icon={{
                                                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                        scaledSize: new window.google.maps.Size(32, 32),
                                                    }}
                                                />
                                            ) : null
                                        ))}
                                    </GoogleMap>
                                </div>
                            </div>
                        </LoadScript>
                    )}
                </div>
            </section>

            {/* Sección de Centros Médicos */}
            <section className="doctors-section" style={{ padding: '40px 20px' }}>
                <h2 style={{ color: '#1ca9bb', textAlign: 'center', marginBottom: '30px' }}>
                    Lista de Centros Médicos
                </h2>
                {medicalCenterError && <div className="alert alert-danger" role="alert">{medicalCenterError}</div>}
                {medicalCenterSuccessMessage && <div className="alert alert-success" role="alert">{medicalCenterSuccessMessage}</div>}
                {isLoading ? (
                    <p style={{ textAlign: 'center' }}>Cargando centros médicos...</p>
                ) : medicalCenters && medicalCenters.length > 0 ? (
                    <>
                        <div className="doctors-container" ref={containerRef}>
                            {medicalCenters.map((center) => (
                                <div className="doctor-card" key={center.id}>
                                    {center.image_url ? (
                                        <img
                                            src={center.image_url}
                                            alt={center.name}
                                            className="doctor-image"
                                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '150px',
                                                backgroundColor: '#e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px 10px 0 0',
                                                color: '#666'
                                            }}
                                        >
                                            Sin Imagen
                                        </div>
                                    )}
                                    <div className="doctor-details" style={{ padding: '15px', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{center.name}</h3>
                                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                                            {center.address || `${center.city}, ${center.country}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="scroll-buttons">
                            <button className="scroll-button" onClick={() => scroll(-200)} aria-label="Desplazar a la izquierda">‹</button>
                            <button className="scroll-button" onClick={() => scroll(200)} aria-label="Desplazar a la derecha">›</button>
                        </div>
                    </>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        {medicalCenterError ? "Error al cargar los datos." : "No se encontraron centros médicos."}
                    </p>
                )}
            </section>

            {/* Botón para volver al Home */}
            <section style={{ textAlign: 'center', padding: '20px' }}>
                <Link to="/">
                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#1ca9bb',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            border: 'none'
                        }}
                    >
                        Volver al Inicio
                    </button>
                </Link>
            </section>
        </div>
    );
}

export default MedicalCenters;