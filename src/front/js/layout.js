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
import { LoginPatient } from "./pages/loginpatient"; 
import { DashboardPatient } from "./pages/dashboardpatient"; 
import { LoginDoctor } from "./pages/logindoctor"; 
import { DashboardDoctor } from "./pages/dashboarddoctor";
import { MedicalCenterDoctor } from "./pages/medicalcenterdoctor"; 
import Reviews from "./pages/Reviews";
import SearchProfessionals from "./pages/SearchProfessionals";
import DoctorProfile from "./pages/DoctorProfile";
import AgendarTurno from "./pages/AgendarTurno";
import { SignupPatient } from "./pages/SignupPatient"; 
import MisCitas from './pages/MisCitas';
import { DoctorAppointment } from "./pages/doctor_appointment";
import { PatientAppointments } from "./pages/patient_appointments"; 
import { RateAppointment } from "./pages/rate_appointment"; 
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
                        <Route element={<LoginPatient />} path="/loginpatient" />
                        <Route element={<DashboardPatient />} path="/dashboardpatient" />
                        <Route element={<LoginDoctor />} path="/logindoctor" />
                        <Route element={<DashboardDoctor />} path="/dashboarddoctor" />
                        <Route element={<MedicalCenterDoctor />} path="/medicalcenterdoctor" />
                        <Route element={<Reviews />} path="/reviews" />
                        <Route element={<SignupPatient />} path="/signuppatient" />
                        <Route element={<SearchProfessionals />} path="/search-professionals" />
                        <Route path="/doctor/:doctorId/:specialtyId" element={<DoctorProfile />} />
                        <Route path="/agendar-turno/:id_doctor/:specialtyId" element={<AgendarTurno />} />
                        <Route path="/miscitas" element={<MisCitas />} />
                        <Route element={<DoctorAppointment />} path="/doctor-appointment" />
                        <Route element={<PatientAppointments />} path="/patient-appointments" />
                        <Route element={<RateAppointment />} path="/rate-appointment/:appointmentId" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                        
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
