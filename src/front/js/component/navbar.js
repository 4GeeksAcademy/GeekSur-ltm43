import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/logo.png';

 export const Navbar = () => {
    return (
        <nav style={{ backgroundColor: 'rgb(100 191 208)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={logo} alt="Logo de Mi Sitio" style={{ height: '90px', width: '10%', margin: '0 50px' }} /> 
            <ul style={{ listStyle: 'none', display: 'flex', margin: 0, margin: '20px 60px', padding: 0 }}>
           
           
             <li style={{ margin: '0 15px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Home</Link>
                </li>
           
                <li style={{ margin: '0 15px' }}>
                    <Link to="/search-professionals" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Necesitas un Medico?</Link>
                </li>

                <li style={{ margin: '0 15px' }}>
                    <Link to="/loginpatient" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Eres un Paciente?</Link>
                </li>

                <li style={{ margin: '0 15px' }}>
                <Link to="/logindoctor" href="#" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Eres un doctor?</Link>
                </li>

            </ul>
        </nav>
    );
};




