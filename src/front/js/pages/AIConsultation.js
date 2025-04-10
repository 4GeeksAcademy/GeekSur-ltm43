import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { FaSearch } from 'react-icons/fa';

export const AIConsultation = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState("");
    const [response, setResponse] = useState({ recommendation: "", specialty: "", doctors: [] });
    const [error, setError] = useState("");

    useEffect(() => {
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        }
    }, [store.authPatient, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResponse({ recommendation: "", specialty: "", doctors: [] });

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
        <div className="container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgb(225 250 255)'
        }}>
            <div style={{
                backgroundColor: 'rgb(152 210 237)',
                padding: '40px',
                borderRadius: '10px',
                width: '500px',
                textAlign: 'center'
            }}>
                <h1 style={{ color: 'white', marginBottom: '30px' }}>Consulta con IA</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <textarea
                        name="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe tus síntomas (ejemplo: dolor de cabeza, fiebre)..."
                        required
                        style={{ padding: '10px', marginBottom: '20px', border: 'none', borderRadius: '5px', height: '100px' }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary d-flex align-items-center gap-2 justify-content-center w-100"
                    >
                        <FaSearch /> Obtener Recomendación
                    </button>
                </form>

                {response.recommendation && (
                    <div style={{ color: 'white', marginTop: '20px', textAlign: 'left' }}>
                        <p>{response.recommendation}</p>
                        {response.doctors.length > 0 && (
                            <button
                                onClick={() => navigate("/dashboardpatient")}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: 'rgb(93 177 212)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Agendar una cita
                            </button>
                        )}
                    </div>
                )}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                <button
                    onClick={() => navigate("/dashboardpatient")}
                    style={{
                        marginTop: '30px',
                        padding: '10px 20px',
                        backgroundColor: 'rgb(93 177 212)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        width: 'auto',
                        cursor: 'pointer'
                    }}
                >
                    Volver al Dashboard
                </button>
            </div>
        </div>
    );
};

export default AIConsultation;