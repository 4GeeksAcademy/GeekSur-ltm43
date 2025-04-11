// import React, { useState, useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate } from "react-router-dom";
// import { FaSearch } from 'react-icons/fa';


// export const AIConsultation = () => {
//     const { store, actions } = useContext(Context);
//     const navigate = useNavigate();
//     const [symptoms, setSymptoms] = useState("");
//     const [recommendation, setRecommendation] = useState("");
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
//             navigate("/loginpatient");
//         }
//     }, [store.authPatient, navigate]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setRecommendation("");

//         try {
//             const response = await fetch(`${process.env.BACKEND_URL}/api/patient/ai-consultation`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${store.tokenpatient || localStorage.getItem("tokenpatient")}`
//                 },
//                 body: JSON.stringify({ symptoms })
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.msg || "Error al consultar la IA");
//             setRecommendation(data.recommendation);
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     return (
//         <div className="container" style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             height: '100vh',
//             backgroundColor: 'rgb(225 250 255)'
//         }}>
//             <div style={{
//                 backgroundColor: 'rgb(152 210 237)',
//                 padding: '40px',
//                 borderRadius: '10px',
//                 width: '500px',
//                 textAlign: 'center'
//             }}>
//                 <h1 style={{ color: 'white', marginBottom: '30px' }}>Consulta con IA</h1>
//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
//                     <textarea
//                         name="symptoms"
//                         value={symptoms}
//                         onChange={(e) => setSymptoms(e.target.value)}
//                         placeholder="Describe tus síntomas (ejemplo: dolor de cabeza, fiebre)..."
//                         required
//                         style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '5px', height: '100px' }}
//                     />
//                     <button
//                         type="submit"
//                         className="btn btn-primary d-flex align-items-center gap-2 justify-content-center w-100"
//                     >
//                         <FaSearch /> Obtener Recomendación
//                     </button>

//                 </form>
//                 {recommendation && <p style={{ color: 'white', marginTop: '20px' }}>{recommendation}</p>}
//                 {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
//                 <button
//                     onClick={() => navigate("/dashboardpatient")}
//                     style={{
//                         marginTop: '30px',
//                         padding: '10px 20px',
//                         backgroundColor: 'rgb(93 177 212)',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px',
//                         width: 'auto',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Volver al Dashboard
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AIConsultation;
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import robot3D from "../../img/robot3D.png";
import logo from "../../img/logo.png";
import { FaSearch } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";


export const AIConsultation = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState("");
    const [response, setResponse] = useState({ recommendation: "", specialty: "", doctors: [] });
    const [error, setError] = useState("");

    ///oscar
    const [recommendation, setRecommendation] = useState("");
    ///

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
        //setResponse({ recommendation: "", specialty: "", doctors: [] });

        //     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setRecommendation("");




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

    return (
        <div className="d-flex" style={{ height: "100vh", backgroundColor: "#e1faff" }}>
            {/* Sidebar */}
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: "280px", backgroundColor: "rgb(100, 191, 208)" }}>
                <a href="/dashboardpatient" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <img src={logo} alt="Logo de Mi Sitio" style={{ height: '100px', width: '100%' }} />
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <Link to="/dashboardpatient" className="nav-link active text-white">
                            <i className="bi bi-house-door me-2"></i>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/panelpatient" className="nav-link text-white">
                            <i className="bi bi-person me-2"></i>
                            Mi Perfil
                        </Link>
                    </li>
                    <li>
                        <Link to="/miscitas" className="nav-link text-white">
                            <i className="bi bi-calendar-check me-2"></i>
                            Mis Citas
                        </Link>
                    </li>
                    <li>
                        <Link to="/search-professionals" className="nav-link text-white">
                            <i className="bi bi-search me-2"></i>
                            Buscar Profesional
                        </Link>
                    </li>
                </ul>
                <hr />
                <button
                    onClick={handleLogout}
                    className="btn text-black"
                    style={{ backgroundColor: "#97dbe7", border: "none", width: "100%" }}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                </button>
            </div>

            {/* Contenido principal */}
            <div className="container d-flex justify-content-center align-items-center" style={{ flex: 1, position: "relative" }}>
                <div className="card shadow p-4" style={{ width: "100%", maxWidth: "600px", borderRadius: "15px", position: "relative" }}>
                    <img
                        src={robot3D}
                        alt="Robot 3D"
                        style={{
                            position: "absolute",
                            top: "-40px",
                            right: "-40px",
                            width: "140px",
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

                    <h1 className="text-center mb-4" style={{ color: "#64bfd0", fontWeight: "bold" }}>Consultale a Boti</h1>

                    <form onSubmit={handleSubmit}>
                        <textarea
                            name="symptoms"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Describe tus síntomas (ejemplo: dolor de cabeza, fiebre)..."
                            required
                            className="form-control mb-3"
                            style={{ height: "100px", resize: "none" }}
                        />

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn d-flex align-items-center justify-content-center gap-2"
                                style={{
                                    backgroundColor: "#97dbe7",
                                    color: "#000",
                                    width: "80%",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px 0",
                                    fontWeight: "bold"
                                }}
                            >
                                <FaSearch /> Obtener Recomendación
                            </button>
                        </div>
                    </form>

                    {response.recommendation && (
                        <div className="mt-4" style={{ textAlign: "left", color: "#333" }}>
                            <p>{response.recommendation}</p>
                            {response.doctors.length > 0 && (
                                <div className="text-center mt-3">
                                    <button
                                        onClick={() => navigate("/dashboardpatient")}
                                        className="btn"
                                        style={{
                                            backgroundColor: "#97dbe7",
                                            color: "#000",
                                            border: "none",
                                            borderRadius: "8px",
                                            padding: "8px 20px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Agendar una cita
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {error && <p className="text-danger mt-3">{error}</p>}

                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate("/dashboardpatient")}
                            className="btn d-flex align-items-center justify-content-center gap-2"
                            style={{
                                backgroundColor: "#97dbe7",
                                color: "#000",
                                width: "60%",
                                border: "2px solid #97dbe7",
                                borderRadius: "8px",
                                padding: "8px 0",
                                fontWeight: "bold"
                            }}
                        >
                            <IoArrowBack /> Volver al Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIConsultation;