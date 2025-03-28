import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>

					<Link to="/patients">
            			<button className="btn btn-primary">Manage Patients</button>
					</Link>
					
					<Link to="/medical-centers">
						<button className="btn btn-primary">Medical Centers</button>
					</Link>

					<Link to="/doctors">
						<button className="btn btn-primary">Doctors</button>
					</Link>

					<Link to="/specialties">
						<button className="btn btn-primary">Specialties</button>
					</Link>

					<Link to="/specialties_doctor">
						<button className="btn btn-primary">Specialties_doctor</button>
					</Link>

					<Link to="/appointments">
						<button className="btn btn-primary">schedule appointment</button>
					</Link>

					<Link to="/loginpatient">
                        <button className="btn btn-primary">Login Patient</button>
                    </Link>
                    
					<Link to="/dashboardpatient">
                        <button className="btn btn-primary">Dashboard Patient</button>
                    </Link>
					<Link to="/reviews">
						<button className="btn btn-primary">Reviews</button>
					</Link>

					<Link to="/logindoctor">
                        <button className="btn btn-primary">Login Doctor</button>
                    </Link>
                    
					<Link to="/dashboarddoctor">
                        <button className="btn btn-primary">Dashboard Doctor</button>
                    </Link>

					<Link to="/medicalcenterdoctor">
                        <button className="btn btn-primary">Medical Center Doctor</button>
                    </Link>

				</div>
			</div>
		</nav>
  );
};
