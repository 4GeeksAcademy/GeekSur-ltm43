import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/medgeek.png';

export const Navbar = () => {
    return (
        <nav style={{ backgroundColor: 'rgb(100 191 208)', color: 'white', padding: '5px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={logo} alt="Logo de Mi Sitio" style={{ height: '70px', width: 'auto', margin: '0 30px' }} /> 
            <ul style={{ listStyle: 'none', display: 'flex', margin: 0, margin: '0 40px', padding: 0 }}>
                <li style={{ margin: '0 15px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Home</Link>
                </li>
                <li style={{ margin: '0 15px' }}>
                    <Link to="/loginpatient" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Eres un Paciente?</Link>
                </li>
                <li style={{ margin: '0 15px' }}>
                    <Link to="/logindoctor" href="#" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>¿Eres un doctor?</Link>
                </li>
                <li style={{ margin: '0 15px' }}>
                    <Link to="/sobre-nosotros" href="#" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Sobre Nosotros</Link>
                </li>
                <li style={{ margin: '0 15px' }}>
                    <Link to="/contactanos" href="#" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>Contáctanos</Link>
                </li>
            </ul>
        </nav>
    );
};