import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const AIConsultation = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!store.authPatient && !localStorage.getItem("tokenpatient")) {
            navigate("/loginpatient");
        }
    }, [store.authPatient, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setRecommendation("");

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/patient/ai-consultation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenpatient || localStorage.getItem("tokenpatient")}`
                },
                body: JSON.stringify({ symptoms })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Error al consultar la IA");
            setRecommendation(data.recommendation);
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
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: 'rgb(93 177 212)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Obtener Recomendación
                    </button>
                </form>
                {recommendation && <p style={{ color: 'white', marginTop: '20px' }}>{recommendation}</p>}
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