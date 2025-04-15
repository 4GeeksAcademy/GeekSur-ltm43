import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "../../styles/home.css";
import doctor1 from "../../img/doctor1.jpg";
import doctor2 from "../../img/doctor2.jpg";
import doctor3 from "../../img/doctor3.jpg";
import doctor4 from "../../img/doctor4.jpg";
import doctor5 from "../../img/doctor5.jpg";
import doctor6 from "../../img/doctor6.jpg";
import doctor7 from "../../img/doctor7.jpg";
import mifoto from "../../img/mifoto.jpg";
import backgroundImage from '../../img/backgroundImage.jpg';
import { Link } from "react-router-dom";

export const Home = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const [nameQuery, setNameQuery] = useState("");
    const [specialtyQuery, setSpecialtyQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(false);



    const scroll = (scrollOffset) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += scrollOffset;
        }
    };

    const handleSearch = async () => {
        setError(false)

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/search-doctor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: nameQuery, specialty: specialtyQuery })
            });
            console.log(response);

            if (!response.ok) {
                // const data = await response.json();
                setError(true);
                setResults([]);
                return;
            }
            const data = await response.json();
            if (data.results.length === 0) {
                setError(true)
            }


            console.log(data.results);
            setResults(data.results)

        } catch (error) {
            console.error("Error al buscar profesionales:", error);
        }
    };

    const doctorsData = [
        { id: 1, name: 'Dr. Juan Pérez', specialty: 'Cardiólogo', image: doctor5, rating: 4.5 },
        { id: 2, name: 'Dra. María García', specialty: 'Dermatólogo', image: doctor6, rating: 4.5 },
        { id: 3, name: 'Dr. Carlos Gómez', specialty: 'Pediatra', image: doctor3, rating: 4.5 },
        { id: 4, name: 'Dra. Emily Jones', specialty: 'Cardiología', image: doctor4, rating: 4.5 },
        { id: 5, name: 'Dr. Mario Fernández', specialty: 'Neurólogo', image: doctor1 },
        { id: 6, name: 'Dr. Alejandro Torres', specialty: 'Traumatólogo', image: doctor2 },
        { id: 7, name: 'Dr. Pablo Núñez', specialty: 'Ginecólogo', image: doctor7 },
    ];

    const specialties = [
        "Cardiólogo", "Dermatólogo", "Pediatra", "Oftalmólogo", "Neurólogo", "Traumatólogo", "Ginecólogo"
    ];

    return (
        <div className="home-container">
            <section
                className="hero"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    padding: '50px 20px',
                    color: 'white'
                }}
            >
                <div className="hero-content">
                    <div className="text-content">
                        <h1 style={{ color: '#1ca9bb' }}>Encontrá tu especialista y pedí turno</h1>
                        <p style={{ color: '#1ca9bb' }}>Accede a una atención médica personalizada a un click.</p>
                        <div className="card text-center" style={{ backgroundColor: '#9de3f0', border: 'none' }}>
                            <div className="card-header">
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <span className="nav-link active">Turno presencial</span>
                                        <span>{error ? "No se encontraron resultados para tu busqueda" : null}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Nombre del Profesional"
                                        value={nameQuery}
                                        onChange={(e) => setNameQuery(e.target.value)}
                                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 2 }}
                                    />
                                    <select
                                        value={specialtyQuery}
                                        onChange={(e) => setSpecialtyQuery(e.target.value)}
                                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1 }}
                                    >
                                        <option>Especialidades</option>
                                        {specialties.map((spec, i) => (
                                            <option key={i} value={spec}>{spec}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleSearch}
                                        style={{
                                            backgroundColor: 'rgb(37 114 123)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px',
                                            flex: 0.5
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section style={{ backgroundColor: 'aliceblue', paddingTop: '40px', paddingBottom: '40px' }}>
                {results.length > 0 && (
                    <div style={{ backgroundColor: 'aliceblue', padding: '2rem 0', minHeight: '50vh' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            {results.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        width: '250px',
                                        padding: '1rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    <img
                                        src="/mifoto.jpg"
                                        alt={`Doctor ${item.name}`}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                    <div className="doctor-details">
                                        <h3>{item.info_doctor.first_name} {item.info_doctor.last_name}</h3>
                                        <p>{item.specialty_name}</p></div>
                                    <p style={{ fontSize: '0.95rem', color: '#636e72', margin: '0.2rem 0 0.5rem' }}>
                                        {item.specialty || 'Especialidad'}
                                    </p>
                                    <div
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#eafaf1',
                                            borderRadius: '8px',
                                            padding: '0.3rem 0.6rem',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            color: '#10ac84',
                                            marginTop: '0.5rem'
                                        }}
                                    >
                                        ⭐ {item.rating || '4.8'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </section>

            <section className="features">
                <div className="feature">
                    <div className="feature-icon">
                        <animated-icons
                            src="https://animatedicons.co/get-icon?name=search&style=minimalistic&token=12e9ffab-e7da-417f-a9d9-d7f67b64d808"
                            trigger="loop"
                            attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#1EB9CAFF","background":"#FFFFFF"}}'
                            height="50"
                            width="50"
                        ></animated-icons>
                    </div>
                    <div className="feature-text">Encontrá tu especialista</div>
                    <p className="feature-description">Las opiniones reales de miles de pacientes van a ayudarte a tomar siempre la mejor decisión.</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">
                        <animated-icons
                            src="https://animatedicons.co/get-icon?name=calendar%20V3&style=minimalistic&token=12e9ffab-e7da-417f-a9d9-d7f67b64d808"
                            trigger="loop"
                            attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#1EB9CAFF","background":"#FFFFFF"}}'
                            height="50"
                            width="50"
                        ></animated-icons>
                    </div>
                    <div className="feature-text">Pedí turno de forma fácil</div>
                    <p className="feature-description">Elegí la hora que prefieras y pedí turno sin necesidad de llamar. Es fácil, cómodo y muy rápido.</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">
                        <animated-icons
                            src="https://animatedicons.co/get-icon?name=mail&style=minimalistic&token=e55f9897-402e-4453-b539-03e933b6d7fa"
                            trigger="loop"
                            attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#33A8BBFF","background":"#FFFFFF"}}'
                            height="60"
                            width="70"
                        ></animated-icons>
                    </div>
                    <div className="feature-text">Recordatorio por email</div>
                    <p className="feature-description">Te confirmamos el turno al instante y te enviamos un recordatorio por email antes del turno.</p>
                </div>
                <div className="feature">
                    <div className="feature-icon">
                        <animated-icons
                            src="https://animatedicons.co/get-icon?name=No%20Money&style=minimalistic&token=ba33e5b0-3a42-4348-aa6c-60d7f1c83cfa"
                            trigger="loop"
                            attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1.02,"defaultColours":{"group-1":"#000000","group-2":"#33A8BBFF","background":"#FFFFFF"}}'
                            height="50"
                            width="50"
                        ></animated-icons>
                    </div>
                    <div className="feature-text">Sin costos extra</div>
                    <p className="feature-description">La reserva de turno es un servicio gratuito de nosotros.</p>
                </div>
            </section>

            <section className="doctors-section">
                <h2>Nuestros Doctores</h2>
                <div className="doctors-container" ref={containerRef}>
                    {doctorsData.map((doctor) => (
                        <div className="doctor-card" key={doctor.id}>
                            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                            <div className="doctor-details">
                                <h3>{doctor.name}</h3>
                                <p>{doctor.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="scroll-buttons">
                    <button className="scroll-button" onClick={() => scroll(-200)} aria-label="Desplazar a la izquierda">‹</button>
                    <button className="scroll-button" onClick={() => scroll(200)} aria-label="Desplazar a la derecha">›</button>
                </div>
            </section>

            {/* Nueva sección para el enlace a MedicalCenters */}
            <section className="medical-centers-link" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h2 style={{ color: '#1ca9bb', marginBottom: '20px' }}>Explorá Nuestros Centros Médicos</h2>
                <p style={{ marginBottom: '30px' }}>Encuentra nuestras sucursales y lee las reseñas de nuestros pacientes.</p>
                <Link to="/medical-centers">
                    <button
                        style={{
                            backgroundColor: '#1ca9bb',
                            color: 'white',
                            border: 'none',
                            padding: '15px 30px',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            margin: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#168a9c'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#1ca9bb'}
                    >
                        Ver Centros Médicos
                    </button>

                    <Link to="/reviews">
                        <button
                            style={{
                                backgroundColor: '#1ca9bb',
                                color: 'white',
                                border: 'none',
                                padding: '15px 30px',
                                borderRadius: '5px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                margin: '10px'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#168a9c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#1ca9bb'}
                        >
                            Nuestra reseñas
                        </button>
                    </Link>
                </Link>

            </section>

            <a
                href="https://wa.me/51929421375" 
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="fab fa-whatsapp whatsapp-icon"></i>
            </a>

        </div>
    );
};

export default Home;