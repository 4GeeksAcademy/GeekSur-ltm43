import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Patients } from "./pages/patients";
import Appointments from './pages/appointments';
import MedicalCenters from "./pages/MedicalCenters"; 
import { Doctors } from "./pages/doctors";
import { Specialties } from "./pages/specialties"; 
import { Specialties_doctor } from "./pages/specialties_doctor";
import { LoginPatient } from "./pages/loginpatient"; // Importar la nueva vista
import { DashboardPatient } from "./pages/dashboardpatient"; // Importar la nueva vista
import { LoginDoctor } from "./pages/logindoctor"; 
import { DashboardDoctor } from "./pages/dashboarddoctor";
import { MedicalCenterDoctor } from "./pages/medicalcenterdoctor"; 
import Reviews from "./pages/Reviews";
import { DoctorAppointment } from "./pages/doctor_appointment";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<Patients />} path="/patients" />
                        <Route element={<Appointments />} path="/appointments" />
                        <Route element={<MedicalCenters />} path="/medical-centers" /> 
                        <Route element={<Doctors />} path="/doctors" />
                        <Route element={<Specialties />} path="/specialties" />
                        <Route element={<Specialties_doctor />} path="/specialties_doctor" />
                        <Route element={<LoginPatient />} path="/loginpatient" /> {/* Nueva ruta */}
                        <Route element={<DashboardPatient />} path="/dashboardpatient" /> {/* Nueva ruta */}
                        <Route element={<LoginDoctor />} path="/logindoctor" />
                        <Route element={<DashboardDoctor />} path="/dashboarddoctor" />
                        <Route element={<MedicalCenterDoctor />} path="/medicalcenterdoctor" />
                        <Route element={<Reviews />} path="/reviews" />
                        <Route element={<DoctorAppointment />} path="/doctor-appointment" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                        
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
