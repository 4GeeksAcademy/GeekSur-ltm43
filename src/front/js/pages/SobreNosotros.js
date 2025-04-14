import React from "react";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import "../../styles/SobreNosotros.css";
import oscar from '../../img/oscar.png';
import alejandro from '../../img/alejandro.png';
import saray from '../../img/saray.png';

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      <Navbar />
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>Descubre ¿Por Qué Creamos Esta Aplicación?<br />Y Nuestro Compromiso</h1>
        <p>
         Nuestra visión: transformar la experiencia de la atencion medica para todos. Un presente donde la salud sea accesible y más fácil de gestionar
        </p>
        <div className="badges">
          <span className="badge">Eficiente</span>
          <span className="badge">Rentable</span>
          <span className="badge">Intuitiva</span>
        </div>
        <div className="images-row">
          <img src="https://img.freepik.com/foto-gratis/equipo-medicos-especialistas-jovenes-pie-pasillo-hospital_1303-21202.jpg?t=st=1744501492~exp=1744505092~hmac=fa700d4863d14de673fdae229be17b6302cda9336b7410765a5bcd6f28d8937f&w=2000" alt="1" />
          <img src="https://enperspectiva.uy/wp-content/uploads/2022/11/Hospital-de-Clinicas.jpg" alt="2" />
          <img src="https://img.freepik.com/foto-gratis/medico-enfermera-ayudando-mujer_23-2148973477.jpg?t=st=1744497513~exp=1744501113~hmac=6ef5a863bc28ba04b55996954798086d6043f5bbc7dad9e819598e19eff83a8c&w=2000" alt="3" />
        </div>
      </section>

      {/* Our Story */}
      <section className="story">
        <h2>Nuestra Historia </h2>
        <p>
        Somos tres estudiantes apasionados de 4Geeks Academy, unidos por el deseo de crear soluciones innovadoras y rentables. Elegimos este proyecto de citas de salud por su enorme potencial y adaptabilidad en el mercado actual. Nos embarcamos en la aventura de desarrollar una plataforma intuitiva y amigable, integrando diversas APIs para facilitar la gestión de turnos médicos.  Nuestra visión con esta aplicación es simplificar el acceso a la salud, permitiendo a los usuarios agendar citas de forma rápida y eficiente.  Cada línea de código y cada elemento de diseño reflejan nuestro compromiso con la calidad y nuestra convicción de que la tecnología puede transformar positivamente la vida de las personas. Cada obstáculo superado fortaleció nuestro compromiso y pasión por este proyecto. Estamos increíblemente entusiasmados con el futuro de nuestra plataforma y su potencial para revolucionar la forma en que las personas acceden a la atención médica. Visualizamos un crecimiento exponencial, expandiendo nuestras funcionalidades y llegando a un público cada vez mayor. 
        </p>
      </section>

      {/* Services */}
      <section className="services">
        <div className="services-grid">
          {[
            { title: "Responsive", desc: "La aplicación se adapta perfectamente a cualquier dispositivo, ya sea un ordenador de escritorio, una tablet o un teléfono móvil, garantizando una experiencia de usuario consistente en todas las plataformas." },
            { title: "Adaptable", desc: "El diseño de la aplicación es altamente adaptable, lo que permite su uso en una amplia gama de sectores y aplicaciones es ideal para diferentes necesidades y modelos de negocio." },
            { title: "APIs", desc: "Hemos integrado diversas APIs para potenciar la funcionalidad de la aplicación, permitiendo la conexión con servicios externos y la automatización de procesos clave." },
            { title: "Amigable", desc: "Priorizamos la experiencia del usuario, asegurando que la aplicación sea accesible para personas de todas las edades y niveles de habilidad tecnológica." },
          ].map((item, idx) => (
            <div className="service-card" key={idx}>
              <div className="icon">★</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="team">
        <h2>Nuestro Equipo:</h2>
        <div className="team-grid">
          {[
            {
              name: "Alejandro Arraga",
              role: "Desarrollador",
              image: "alejandro.png"
            },
            {
              name: "Saray Rodríguez",
              role: "Desarrolladora",
              image: "saray.png"
            },
            {
              name: "Oscar Villalobos",
              role: "Desarrollador",
              image: "oscar.png"
            },
            
          ].map((member, idx) => (
            <div className="member" key={idx}>
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </div>

  );
};

export default SobreNosotros;
