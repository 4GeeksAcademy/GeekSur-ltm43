import React from 'react';
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; 

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <img src={logo} alt="Logo de GeekSur" style={{ height: '100px' }} />
                    <p>+1234 568 963</p>
                    <p>tumedico@gmail.com</p>
                </div>
                <div className="footer-section">
                    <h3>Pagina</h3>
                    <ul>
                        <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
                        <li><Link to="/contactanos">Contactanos</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Link</h3>
                    <ul>
                        <li><a href="#">Sign up</a></li>
                        <li><a href="#">Sign in</a></li>
                        <li><a href="#">Terminos</a></li>
                        <li><a href="#">Cookies</a></li>
                        <li><a href="#">Soporte</a></li>
                    </ul>
                </div>
                <div className="footer-section"> 
                    <h3>Siguenos</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <a 
                            href="https://www.facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'white', margin: '0 5px', backgroundColor: '#3b5998', padding: '5px' }}
                        >
                            <FaFacebookF />
                        </a>
                        <a 
                            href="https://www.instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'white', margin: '0 5px', backgroundColor: '#e4405f', padding: '5px' }}
                        >
                            <FaInstagram />
                        </a>
                        <a 
                            href="https://www.linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: 'white', margin: '0 5px', backgroundColor: '#0077b5', padding: '5px' }}
                        >
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyrights © 2025. Build by Alejandro A, Saray R, Oscar V.</p>
                <div className="footer-bottom-links">
                    <a href="#">Privacy policy</a>
                    <a href="#">Terminos y condiciones</a>
                </div>
            </div>
        </footer>
    );
};