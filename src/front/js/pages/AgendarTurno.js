// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams  } from 'react-router-dom';

// function AgendarTurno() {
//     const { id_doctor, specialtyId } = useParams();
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [selectedTime, setSelectedTime] = useState('07:15');
//     const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
//     const [medicalCenters, setMedicalCenters] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetch(process.env.BACKEND_URL + '/api/medical_centers')
//             .then(response => response.json())
//             .then(data => {
//                 // console.log('Medical Centers:', data);
//                 setMedicalCenters(data);
//             })
//             .catch(error => {
//                 console.error('Error al obtener los consultorios:', error);   
//             });
//     }, []);

//     const handleDateChange = (event) => {
//         setSelectedDate(new Date(event.target.value));
//     };

//     const handleTimeChange = (event) => {
//         setSelectedTime(event.target.value);
//     };

//     const handleMedicalCenterChange = (event) => {
//         setSelectedMedicalCenter(event.target.value);
//     };

//     const handleSubmit = async () => {
//         const token = localStorage.getItem('tokenpatient');

//         if (!token) {
//             alert('Debes iniciar sesión para agendar una cita.');
//             return;
//         }

//         try {
//             const response = await fetch(process.env.BACKEND_URL + '/api/appointments', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     date: selectedDate.toISOString().split('T')[0],
//                     hour: selectedTime,
//                     id_center: selectedMedicalCenter,
//                     id_doctor: id_doctor,
//                     id_specialty: specialtyId,
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Error al agendar la cita...');
//             }

//             const citaAgendada = {
//                 fecha: selectedDate.toISOString().split('T')[0],
//                 hora: selectedTime,
//                 consultorio: selectedMedicalCenter,
//                 doctor: id_doctor,
//                 specialty: specialtyId,
//             };

//             navigate('/patient-appointments', { state: { cita: citaAgendada } });
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Error al agendar la cita.');
//         }
//     };
    
//     const handledashboard = () => {
//         navigate('/dashboardpatient');
//       };

//     const handleSearch = () => {
//         navigate('/search-professionals');
//       }; 



//     return (
//         <div style={{
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             minHeight: '100vh',
//             backgroundColor: 'rgb(225 250 255)'
//         }}>
//             <div style={{
//                 backgroundColor: 'rgb(152 210 237)',
//                 padding: '40px',
//                 borderRadius: '10px',
//                 width: '90%',
//                 maxWidth: '600px',
//                 textAlign: 'left',
//                 color: 'white'
//             }}>
//                 <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Agenda tu cita :</h2>

//                 <div style={{ marginBottom: '20px' }}>
//                     <label htmlFor="date" style={{ display: 'block', marginBottom: '5px' }}>Selecciona la fecha</label>
//                     <input
//                         type="date"
//                         id="date"
//                         value={selectedDate.toISOString().split('T')[0]}
//                         onChange={handleDateChange}
//                         style={{ padding: '10px', border: 'none', borderRadius: '5px', width: '100%', backgroundColor: '#f0f0f0', color: 'black' }}
//                     />
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                     <label htmlFor="time" style={{ display: 'block', marginBottom: '5px' }}>Selecciona la hora</label>
//                     <input
//                         type="time"
//                         id="time"
//                         value={selectedTime}
//                         onChange={handleTimeChange}
//                         style={{ padding: '10px', border: 'none', borderRadius: '5px', width: '100%', backgroundColor: '#f0f0f0', color: 'black' }}
//                     />
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                     <label htmlFor="medicalCenter" style={{ display: 'block', marginBottom: '5px' }}>Selecciona el consultorio</label>
//                     <select
//                         id="medicalCenter"
//                         value={selectedMedicalCenter}
//                         onChange={handleMedicalCenterChange}
//                         style={{ padding: '10px', border: 'none', borderRadius: '5px', width: '100%', backgroundColor: '#f0f0f0', color: 'black' }}
//                     >
//                         <option value="">Selecciona un consultorio</option>
//                         {medicalCenters.map(center => (
//                             <option key={center.id} value={center.id}>
//                                 {center.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>

//                     <button style={{ backgroundColor: 'rgb(93 177 212)', color: 'white', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                     onClick={handledashboard}
//                     > 
//                     DashBoard
//                     </button>


//                     <button style={{ backgroundColor: 'rgb(93 177 212)', color: 'white', padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                     onClick={handleSearch}
//                     >
//                         Cancelar
//                     </button>




//                     <button
//                         style={{ backgroundColor: 'rgb(93 177 212)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//                         onClick={handleSubmit}
//                     >
//                         OK
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AgendarTurno;

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { Context } from "../store/appContext";
// import logo from "../../img/logo.png";
// import { useLocation } from "react-router-dom";

// function AgendarTurno() {
//     const { id_doctor, specialtyId } = useParams();
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [selectedTime, setSelectedTime] = useState('07:15');
//     const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
//     const [medicalCenters, setMedicalCenters] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { store, actions } = useContext(Context);
    
//     const [currentTime, setCurrentTime] = useState(
//         new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );
//     const [showDropdown, setShowDropdown] = useState(false);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
//         }, 60000);
//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         fetch(process.env.BACKEND_URL + '/api/medical_centers')
//             .then(response => response.json())
//             .then(data => {
//                 setMedicalCenters(data);
//             })
//             .catch(error => {
//                 console.error('Error al obtener los consultorios:', error);   
//             });
//     }, []);

//     const handleDateChange = (event) => {
//         setSelectedDate(new Date(event.target.value));
//     };

//     const handleTimeChange = (event) => {
//         setSelectedTime(event.target.value);
//     };

//     const handleMedicalCenterChange = (event) => {
//         setSelectedMedicalCenter(event.target.value);
//     };

//     const handleSubmit = async () => {
//         const token = localStorage.getItem('tokenpatient');

//         if (!token) {
//             alert('Debes iniciar sesión para agendar una cita.');
//             return;
//         }

//         try {
//             const response = await fetch(process.env.BACKEND_URL + '/api/appointments', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     date: selectedDate.toISOString().split('T')[0],
//                     hour: selectedTime,
//                     id_center: selectedMedicalCenter,
//                     id_doctor: id_doctor,
//                     id_specialty: specialtyId,
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Error al agendar la cita...');
//             }

//             const citaAgendada = {
//                 fecha: selectedDate.toISOString().split('T')[0],
//                 hora: selectedTime,
//                 consultorio: selectedMedicalCenter,
//                 doctor: id_doctor,
//                 specialty: specialtyId,
//             };

//             navigate('/patient-appointments', { state: { cita: citaAgendada } });
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Error al agendar la cita.');
//         }
//     };
    
//     const handleLogout = () => {
//         actions.logoutPatient();
//         navigate("/loginpatient");
//     };

//     const patient = store.currentPatient;
//     const patientLocation = patient?.city ? `${patient.city}, ${patient.country || 'CA'}` : "San Francisco, CA";

//     return (
//         <>
//             {store.authPatient || localStorage.getItem("tokenpatient") ? (
//                 <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f0faff" }}>
//                     {/* Sidebar fijo */}
//                     <div
//                         className="d-flex flex-column flex-shrink-0 py-3 text-white"
//                         style={{
//                             width: "280px",
//                             backgroundColor: "rgb(100, 191, 208)",
//                             position: "fixed",
//                             height: "100vh",
//                             overflowY: "auto",
//                         }}
//                     >
//                         <a
//                             href="/dashboardpatient"
//                             className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
//                         >
//                             <img src={logo} alt="Logo" style={{ height: "100px", width: "100%" }} />
//                         </a>
//                         <hr />
//                         <ul className="nav nav-pills flex-column mb-auto">
//                             <li className="nav-item">
//                                 <Link
//                                     to="/dashboardpatient"
//                                     className={`nav-link text-white d-flex align-items-center ${
//                                         location.pathname === "/dashboardpatient" ? "active" : ""
//                                     }`}
//                                     style={{
//                                         padding: "10px 0",
//                                         margin: "0 -15px",
//                                         borderRadius: "0",
//                                     }}
//                                 >
//                                     <i className="bi bi-house-door me-2 fs-5" style={{ marginLeft: "15px" }}></i>
//                                     Dashboard
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link
//                                     to="/panelpatient"
//                                     className={`nav-link text-white d-flex align-items-center ${
//                                         location.pathname === "/panelpatient" ? "active" : ""
//                                     }`}
//                                     style={{
//                                         padding: "10px 0",
//                                         margin: "0 -15px",
//                                         borderRadius: "0",
//                                     }}
//                                 >
//                                     <i className="bi bi-person me-2 fs-5" style={{ marginLeft: "15px" }}></i>
//                                     Mi Perfil
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link
//                                     to="/patient-appointments"
//                                     className={`nav-link text-white d-flex align-items-center ${
//                                         location.pathname === "/patient-appointments" ? "active" : ""
//                                     }`}
//                                     style={{
//                                         padding: "10px 0",
//                                         margin: "0 -15px",
//                                         borderRadius: "0",
//                                     }}
//                                 >
//                                     <i className="bi bi-calendar-check me-2 fs-5" style={{ marginLeft: "15px" }}></i>
//                                     Mis Citas
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link
//                                     to="/search-professionals"
//                                     className={`nav-link text-white d-flex align-items-center ${
//                                         location.pathname === "/search-professionals" ? "active" : ""
//                                     }`}
//                                     style={{
//                                         padding: "10px 0",
//                                         margin: "0 -15px",
//                                         borderRadius: "0",
//                                     }}
//                                 >
//                                     <i className="bi bi-search me-2 fs-5" style={{ marginLeft: "15px" }}></i>
//                                     Buscar Profesional
//                                 </Link>
//                             </li>
//                         </ul>
//                         <hr />
//                         <button
//                             onClick={handleLogout}
//                             className="btn d-flex align-items-center"
//                             style={{
//                                 backgroundColor: "#ffffff",
//                                 color: "#000",
//                                 border: "1px solid #000",
//                                 padding: "10px",
//                                 borderRadius: "5px",
//                                 fontWeight: "500",
//                                 whiteSpace: "nowrap",
//                                 width: "fit-content",
//                                 maxWidth: "100%",
//                                 margin: "0 auto",
//                             }}
//                         >
//                             <i className="bi bi-box-arrow-right me-2 fs-5"></i>
//                             Cerrar Sesión
//                         </button>
//                     </div>

//                     {/* Contenido principal */}
//                     <div
//                         className="flex-grow-1 p-4 d-flex align-items-center justify-content-center"
//                         style={{
//                             backgroundColor: "#f0faff",
//                             color: "#000",
//                             marginLeft: "280px",
//                         }}
//                     >
//                         <div className="card shadow-sm" style={{ 
//                             backgroundColor: "#f8f9fa", 
//                             border: "1px solid #dee2e6",
//                             borderRadius: "10px",
//                             padding: "40px",
//                             width: "100%",
//                             maxWidth: "600px"
//                         }}>
//                             <h2 className="text-center mb-4">Agendar Cita</h2>

//                             <div className="mb-3">
//                                 <label htmlFor="date" className="form-label">Fecha</label>
//                                 <input
//                                     type="date"
//                                     id="date"
//                                     className="form-control"
//                                     value={selectedDate.toISOString().split('T')[0]}
//                                     onChange={handleDateChange}
//                                     style={{ border: "1px solid #000" }}
//                                 />
//                             </div>

//                             <div className="mb-3">
//                                 <label htmlFor="time" className="form-label">Hora</label>
//                                 <input
//                                     type="time"
//                                     id="time"
//                                     className="form-control"
//                                     value={selectedTime}
//                                     onChange={handleTimeChange}
//                                     style={{ border: "1px solid #000" }}
//                                 />
//                             </div>

//                             <div className="mb-4">
//                                 <label htmlFor="medicalCenter" className="form-label">Consultorio</label>
//                                 <select
//                                     id="medicalCenter"
//                                     className="form-select"
//                                     value={selectedMedicalCenter}
//                                     onChange={handleMedicalCenterChange}
//                                     style={{ border: "1px solid #000" }}
//                                 >
//                                     <option value="">Selecciona un consultorio</option>
//                                     {medicalCenters.map(center => (
//                                         <option key={center.id} value={center.id}>
//                                             {center.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="d-flex justify-content-end gap-2">

//                                 <button 
//                                     className="btn"
//                                     onClick={() => navigate('/search-professionals')}
//                                     style={{ 
//                                         backgroundColor: "rgb(93 177 212)", 
//                                         color: "#fff",
//                                         border: "1px solid #000"
//                                     }}
//                                 >
//                                     Cancelar
//                                 </button>
//                                 <button
//                                     className="btn"
//                                     onClick={handleSubmit}
//                                     style={{ 
//                                         backgroundColor: "rgb(93 177 212)", 
//                                         color: "#fff",
//                                         border: "1px solid #000"
//                                     }}
//                                 >
//                                     Confirmar
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <Navigate to="/loginpatient" />
//             )}

//             {/* Estilos CSS */}
//             <style>{`
//                 .nav-link.active {
//                     background-color: #f0faff !important;
//                     color: #000 !important;
//                 }
//             `}</style>
//         </>
//     );
// }

// export default AgendarTurno;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";
import { useLocation } from "react-router-dom";

function AgendarTurno() {
    const { id_doctor, specialtyId } = useParams();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('07:00'); // Valor inicial a las 7:00 AM
    const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
    const [medicalCenters, setMedicalCenters] = useState([]);
    const [timeOptions, setTimeOptions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { store, actions } = useContext(Context);
    
    // Generar opciones de horario cada 15 minutos
    useEffect(() => {
        const options = [];
        for (let hour = 7; hour < 20; hour++) { // Desde las 7 AM hasta las 8 PM
            for (let minute = 0; minute < 60; minute += 15) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(timeString);
            }
        }
        setTimeOptions(options);
    }, []);

    // Resto del código permanece igual...
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
        fetch(process.env.BACKEND_URL + '/api/medical_centers')
            .then(response => response.json())
            .then(data => {
                setMedicalCenters(data);
            })
            .catch(error => {
                console.error('Error al obtener los consultorios:', error);   
            });
    }, []);

    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleMedicalCenterChange = (event) => {
        setSelectedMedicalCenter(event.target.value);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('tokenpatient');

        if (!token) {
            alert('Debes iniciar sesión para agendar una cita.');
            return;
        }

        try {
            const response = await fetch(process.env.BACKEND_URL + '/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate.toISOString().split('T')[0],
                    hour: selectedTime,
                    id_center: selectedMedicalCenter,
                    id_doctor: id_doctor,
                    id_specialty: specialtyId,
                })
            });

            if (!response.ok) {
                throw new Error('Error al agendar la cita...');
            }

            const citaAgendada = {
                fecha: selectedDate.toISOString().split('T')[0],
                hora: selectedTime,
                consultorio: selectedMedicalCenter,
                doctor: id_doctor,
                specialty: specialtyId,
            };

            navigate('/patient-appointments', { state: { cita: citaAgendada } });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agendar la cita.');
        }
    };
    
    const handleLogout = () => {
        actions.logoutPatient();
        navigate("/loginpatient");
    };

    const patient = store.currentPatient;
    const patientLocation = patient?.city ? `${patient.city}, ${patient.country || 'CA'}` : "San Francisco, CA";

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
                        </ul>
                        <hr />
                        <button
                            onClick={handleLogout}
                            className="btn d-flex align-items-center"
                            style={{
                                backgroundColor: "#ffffff",
                                color: "#000",
                                border: "1px solid #000",
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
                        className="flex-grow-1 p-4 d-flex align-items-center justify-content-center"
                        style={{
                            backgroundColor: "#f0faff",
                            color: "#000",
                            marginLeft: "280px",
                        }}
                    >
                        <div className="card shadow-sm" style={{ 
                            backgroundColor: "#f8f9fa", 
                            border: "1px solid #dee2e6",
                            borderRadius: "10px",
                            padding: "40px",
                            width: "100%",
                            maxWidth: "600px"
                        }}>
                            <h2 className="text-center mb-4">Agendar Cita</h2>

                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Fecha</label>
                                <input
                                    type="date"
                                    id="date"
                                    className="form-control"
                                    value={selectedDate.toISOString().split('T')[0]}
                                    onChange={handleDateChange}
                                    style={{ border: "1px solid #000" }}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="time" className="form-label">Hora</label>
                                <select
                                    id="time"
                                    className="form-select"
                                    value={selectedTime}
                                    onChange={handleTimeChange}
                                    style={{ border: "1px solid #000" }}
                                >
                                    {timeOptions.map((time, index) => (
                                        <option key={index} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="medicalCenter" className="form-label">Consultorio</label>
                                <select
                                    id="medicalCenter"
                                    className="form-select"
                                    value={selectedMedicalCenter}
                                    onChange={handleMedicalCenterChange}
                                    style={{ border: "1px solid #000" }}
                                >
                                    <option value="">Selecciona un consultorio</option>
                                    {medicalCenters.map(center => (
                                        <option key={center.id} value={center.id}>
                                            {center.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-flex justify-content-end gap-2">

                                <button 
                                    className="btn"
                                    onClick={() => navigate('/search-professionals')}
                                    style={{ 
                                        backgroundColor: "rgb(93 177 212)", 
                                        color: "#fff",
                                        border: "1px solid #000"
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn"
                                    onClick={handleSubmit}
                                    style={{ 
                                        backgroundColor: "rgb(93 177 212)", 
                                        color: "#fff",
                                        border: "1px solid #000"
                                    }}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
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

export default AgendarTurno;
