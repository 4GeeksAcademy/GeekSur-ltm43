// import React, { useState, useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, Link } from "react-router-dom";
// import robot3D from "../../img/robot3D.png";
// import logo from "../../img/logo.png";
// import { FaSearch } from "react-icons/fa";
// import { IoArrowBack } from "react-icons/io5";

// export const AIConsultation = () => {
//     const { store, actions } = useContext(Context);
//     const navigate = useNavigate();
//     const [symptoms, setSymptoms] = useState("");
//     const [response, setResponse] = useState({ recommendation: "", specialty: "", doctors: [] });
//     const [error, setError] = useState("");
//     const [recommendation, setRecommendation] = useState("");


//     useEffect(() => {
//         if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
//             navigate("/loginpatient");
//         }
//     }, [store.authPatient, navigate]);

//     const handleLogout = () => {
//         actions.logoutPatient();
//         navigate("/loginpatient");
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         setRecommendation("");

//         try {
//             const apiResponse = await fetch(`${process.env.BACKEND_URL}/api/patient/ai-consultation`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${store.tokenpatient || localStorage.getItem("tokenpatient")}`
//                 },
//                 body: JSON.stringify({ symptoms })
//             });
//             const data = await apiResponse.json();
//             if (!apiResponse.ok) throw new Error(data.msg || "Error al consultar la IA");

//             setResponse({
//                 recommendation: data.recommendation,
//                 specialty: data.specialty,
//                 doctors: data.doctors
//             });
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (

//         <div className="d-flex" style={{ height: "100vh", backgroundColor: "#e1faff" }}>
//             {/* Sidebar */}
//             <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}>
//                 <a href="/dashboardpatient" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
//                     <img src={logo} alt="Logo de Mi Sitio" style={{ height: '100px', width: '100%' }} />
//                 </a>
//                 <hr />
//                 <ul className="nav nav-pills flex-column mb-auto">
//                     <li className="nav-item">
//                         <Link to="/dashboardpatient" className="nav-link active text-white">
//                             <i className="bi bi-house-door me-2"></i>
//                             Dashboard
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/panelpatient" className="nav-link text-white">
//                             <i className="bi bi-person me-2"></i>
//                             Mi Perfil
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/patient-appointments" className="nav-link text-white">
//                             <i className="bi bi-calendar-check me-2"></i>
//                             Mis Citas
//                         </Link>
//                     </li>
//                     <li>
//                         <Link to="/search-professionals" className="nav-link text-white">
//                             <i className="bi bi-search me-2"></i>
//                             Buscar Profesional
//                         </Link>
//                     </li>
//                     <Link
//                             to="/ai-consultation"
//                             className={`nav-link text-white d-flex align-items-center ${
//                                 location.pathname === "/ai-consultation" ? "active" : ""
//                             }`}
//                             style={{
//                                 padding: "10px 0",
//                                 margin: "0 -15px",
//                                 borderRadius: "0",
//                             }}
//                         >
//                             <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
//                             Habla Con Boti IA
//                         </Link>
                    
//                 </ul>
//                 <hr />

//                 <button
//                     onClick={handleLogout}
//                     className="btn text-black"
//                     style={{ backgroundColor: "#97dbe7", border: "none", width: "100%" }}
//                 >
//                     <i className="bi bi-box-arrow-right me-2"></i>
//                     Cerrar Sesión
//                 </button>
//             </div>

//             {/* Contenido principal */}
//             <div className="container d-flex justify-content-center align-items-center" style={{ flex: 1, position: "relative" }}>
//                 <div className="card shadow p-4" style={{ width: "100%", maxWidth: "600px", borderRadius: "15px", position: "relative" }}>
//                     <img
//                         src={robot3D}
//                         alt="Robot 3D"
//                         style={{
//                             position: "absolute",
//                             top: "-40px",
//                             right: "-40px",
//                             width: "140px",
//                             height: "auto",
//                             animation: "float 3s ease-in-out infinite",
//                             zIndex: 1
//                         }}
//                     />
//                     <style>{`
//                         @keyframes float {
//                             0% { transform: translateY(0px); }
//                             50% { transform: translateY(-10px); }
//                             100% { transform: translateY(0px); }
//                         }
//                     `}</style>

//                     <h1 className="text-center mb-4" style={{ color: "#64bfd0", fontWeight: "bold" }}>Consultale a Boti</h1>

//                     <form onSubmit={handleSubmit}>
//                         <textarea
//                             name="symptoms"
//                             value={symptoms}
//                             onChange={(e) => setSymptoms(e.target.value)}
//                             placeholder="Describe tus síntomas (ejemplo: dolor de cabeza, fiebre)..."
//                             required
//                             className="form-control mb-3"
//                             style={{ height: "100px", resize: "none" }}
//                         />

//                         <div className="text-center">
//                             <button
//                                 type="submit"
//                                 className="btn d-flex align-items-center justify-content-center gap-2"
//                                 style={{
//                                     backgroundColor: "#97dbe7",
//                                     color: "#000",
//                                     width: "80%",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     padding: "10px 0",
//                                     fontWeight: "bold"
//                                 }}
//                             >
//                                 <FaSearch /> Obtener Recomendación
//                             </button>
//                         </div>
//                     </form>

//                     {response.recommendation && (
//                         <div className="mt-4" style={{ textAlign: "left", color: "#333" }}>
//                             <p>{response.recommendation}</p>
//                             {response.doctors.length > 0 && (
//                                 <div className="text-center mt-3">
//                                     <button
//                                         onClick={() => navigate("/dashboardpatient")}
//                                         className="btn"
//                                         style={{
//                                             backgroundColor: "#97dbe7",
//                                             color: "#000",
//                                             border: "none",
//                                             borderRadius: "8px",
//                                             padding: "8px 20px",
//                                             fontWeight: "bold"
//                                         }}
//                                     >
//                                         Agendar una cita
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {error && <p className="text-danger mt-3">{error}</p>}

//                     <div className="text-center mt-4">

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AIConsultation;
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import robot3D from "../../img/robot3D.png";
import logo from "../../img/logo.png";
import { FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

export const AIConsultation = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [symptoms, setSymptoms] = useState("");
    const [response, setResponse] = useState({ recommendation: "", specialty: "", doctors: [] });
    const [error, setError] = useState("");
    const [recommendation, setRecommendation] = useState("");
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
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        }
    }, [store.authPatient, navigate]);

    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setRecommendation("");

        try {
            const apiResponse = await fetch(`${process.env.BACKEND_URL}/api/patient/ai-consultation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenpatient || localStorage.getItem("tokenpatient")}`
                },
                body: JSON.stringify({ symptoms })
            });
            const data = await apiResponse.json();
            if (!apiResponse.ok) throw new Error(data.msg || "Error al consultar la IA");

            setResponse({
                recommendation: data.recommendation,
                specialty: data.specialty,
                doctors: data.doctors
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const patient = store.currentPatient;
    const patientLocation = patient?.city ? `${patient.city}, ${patient.country || 'CA'}` : "San Francisco, CA";

    return (
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
                            <i className="bi bi-robot me-2 fs-5" style={{ marginLeft: "15px" }}></i>
                            Chat con Boti IA
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
                className="flex-grow-1 p-4 d-flex justify-content-center align-items-center"
                style={{
                    backgroundColor: "#f0faff",
                    color: "#000",
                    marginLeft: "280px",
                }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4 position-absolute top-0 end-0 p-4">
                    <div className="d-flex align-items-center position-relative">
                        <span className="text-dark me-3" style={{ opacity: 0.8 }}>
                            <i className="bi bi-geo-alt me-1"></i>
                            {patientLocation} - {currentTime}
                        </span>
                        {patient?.url && (
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
                        )}
                    </div>
                </div>

                <div className="card shadow-sm position-relative" style={{ 
                    width: "100%", 
                    maxWidth: "600px", 
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "10px",
                    padding: "30px"
                }}>
                    <img
                        src={robot3D}
                        alt="Robot 3D"
                        style={{
                            position: "absolute",
                            top: "-50px",
                            right: "-50px",
                            width: "120px",
                            height: "auto",
                            animation: "float 3s ease-in-out infinite",
                            zIndex: 1
                        }}
                    />
                    <style>{`
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                            100% { transform: translateY(0px); }
                        }
                    `}</style>

                    <h1 className="text-center mb-4" style={{ color: "rgb(100, 191, 208)", fontWeight: "bold" }}>Consulta a Boti IA</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Describe tus síntomas</label>
                            <textarea
                                name="symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Ejemplo: dolor de cabeza, fiebre, malestar general..."
                                required
                                className="form-control"
                                style={{ 
                                    height: "150px", 
                                    resize: "none",
                                    border: "1px solid #000"
                                }}
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn d-flex align-items-center justify-content-center gap-2"
                                style={{
                                    backgroundColor: "#97dbe7",
                                    color: "#000",
                                    borderRadius: "5px",
                                    padding: "10px 20px",
                                    fontWeight: "500",
                                    width: "100%"
                                }}
                            >
                                <FaSearch /> Obtener Recomendación
                            </button>
                        </div>
                    </form>

                    {response.recommendation && (
                        <div className="mt-4 p-3" style={{ 
                            backgroundColor: "#fff",
                            border: "1px solid #dee2e6",
                            borderRadius: "5px"
                        }}>
                            <p>{response.recommendation}</p>
                            {response.doctors.length > 0 && (
                                <div className="text-center mt-3">
                                    <button
                                        onClick={() => navigate("/search-professionals")}
                                        className="btn"
                                        style={{
                                            backgroundColor: "#97dbe7",
                                            color: "#000",
                                            border: "1px solid #000",
                                            borderRadius: "5px",
                                            padding: "8px 20px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        Buscar Especialista
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Estilos CSS */}
            <style>{`
                .nav-link.active {
                    background-color: #f0faff !important;
                    color: #000 !important;
                }
            `}</style>
        </div>
    );
};

export default AIConsultation;