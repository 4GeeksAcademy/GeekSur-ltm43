import React, { useEffect, useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import "../../styles/home.css";
import hospitalcaracas from '../../img/hospitalcaracas.jpg';
import hospitalsantiago from '../../img/hospitalsantiago.jpg';
import hospitalauckland from '../../img/hospitalauckland.jpg';
import hospitalbuenosaires from '../../img/hospitalbuenosaires.jpg';
import hospitalmaracaibo from '../../img/hospitalmaracaibo.jpg';

const libraries = ["places"];
const defaultCenter = { lat: 40.749933, lng: -73.98633 };

// Mapa de imágenes según el nombre del centro médico
const hospitalImages = {
    "Clinica Caracas": hospitalcaracas,
    "Clinica Santiago": hospitalsantiago,
    "Clinica Auckland": hospitalauckland,
    "Clinica Buenos Aires": hospitalbuenosaires,
    "Clinica Maracaibo": hospitalmaracaibo,
};

function MedicalCenters() {
    const { store } = useContext(Context);
    const { medicalCenters, medicalCenterError, medicalCenterSuccessMessage } = store || {};
    const { getMedicalCenters } = actions || {};

    const mapRef = useRef(null);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    useEffect(() => {
        if (!getMedicalCenters) {
            console.error("getMedicalCenters no está definido en el contexto.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        console.log("Iniciando carga de centros médicos...");
        getMedicalCenters()
            .then(() => {
                console.log("Centros médicos cargados:", medicalCenters);
                if (medicalCenters?.length > 0) {
                    adjustMapBounds(medicalCenters);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener centros médicos:", error);
                setIsLoading(false);
            });
    }, [getMedicalCenters]);

    const onLoadMap = (map) => {
        mapRef.current = map;
        setIsMapLoaded(true);
        console.log("Mapa cargado, ajustando bounds...");
        adjustMapBounds(medicalCenters);
    };

    const adjustMapBounds = (centers) => {
        if (!mapRef.current || !centers?.length) {
            console.warn("No hay mapa o centros para ajustar.");
            return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        let hasValidCoords = false;

        centers.forEach(center => {
            if (center?.latitude && center?.longitude) {
                console.log(`Añadiendo marcador para ${center.name} en (${center.latitude}, ${center.longitude})`);
                bounds.extend({ lat: parseFloat(center.latitude), lng: parseFloat(center.longitude) });
                hasValidCoords = true;
            } else {
                console.warn(`No hay coordenadas para ${center?.name || "centro desconocido"}`);
            }
        });

        if (hasValidCoords) {
            console.log("Ajustando bounds del mapa...");
            mapRef.current.fitBounds(bounds);
        } else {
            console.warn("No hay coordenadas válidas para ajustar el mapa.");
            setCenter(defaultCenter);
        }
    };

    const onLoadAutocomplete = (autocomplete) => {
        inputRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (!inputRef.current) return;
        const place = inputRef.current.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            setCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
            console.log("Ubicación seleccionada:", { lat, lng });
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
            {/* Sección de Mapa y Autocomplete */}
            <section style={{ padding: '40px 20px', backgroundColor: 'rgb(255, 255, 255)' }}>
                <div className="container">
                    <h2 style={{ color: '#1ca9bb', textAlign: 'center', marginBottom: '30px' }}>
                        Busca tu Ubicación
                    </h2>
                    {isLoading ? (
                        <p style={{ textAlign: 'center' }}>Cargando mapa...</p>
                    ) : medicalCenterError ? (
                        <div className="alert alert-danger">{medicalCenterError}</div>
                    ) : (
                        <LoadScript
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
                            libraries={libraries}
                            onError={(error) => {
                                console.error("Error al cargar Google Maps:", error);
                                setIsMapLoaded(false);
                            }}
                            onLoad={() => setIsMapLoaded(true)}
                        >
                            <div className="row justify-content-center">
                                <div className="col-md-6">
                                    <div className="card p-4 shadow-sm" type="search" style={{ backgroundColor: '#9de3f0', border: 'none' }}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="pac-input" style={{ color: '#1ca9bb' }}>Ingresa tu dirección</label>
                                            <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                                                <input
                                                    id="pac-input"
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
                            {isMapLoaded ? (
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
                                                        scaledSize: isMapLoaded && window.google?.maps ? new window.google.maps.Size(32, 32) : undefined,
                                                    }}
                                                />
                                            )}
                                            {medicalCenters?.length > 0 && isMapLoaded && window.google?.maps && medicalCenters.map(center => (
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
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>No se pudo cargar el mapa.</p>
                            )}
                        </LoadScript>
                    )}
                </div>
            </section>

            {/* Sección de Centros Médicos */}
            <section className="doctors-section" style={{ padding: '40px 20px' }}>
                <h2 style={{ color: '#1ca9bb', textAlign: 'center', marginBottom: '30px' }}>
                    Nuestros Centros Médicos
                </h2>
                {medicalCenterError && <div className="alert alert-danger" role="alert">{medicalCenterError}</div>}
                {medicalCenterSuccessMessage && <div className="alert alert-success" role="alert">{medicalCenterSuccessMessage}</div>}
                {isLoading ? (
                    <p style={{ textAlign: 'center' }}>Cargando centros médicos...</p>
                ) : medicalCenters?.length > 0 ? (
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
                                            onError={(e) => {
                                                e.target.onerror = null; // Evita bucles infinitos si la imagen falla
                                                e.target.src = hospitalImages[center.name] || hospitalcaracas; // Usa la imagen correspondiente o hospitalcaracas como fallback
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={hospitalImages[center.name] || hospitalcaracas} // Usa la imagen correspondiente o hospitalcaracas como fallback
                                            alt={center.name}
                                            className="doctor-image"
                                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                                        />
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
                        <div className="scroll-buttons" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
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