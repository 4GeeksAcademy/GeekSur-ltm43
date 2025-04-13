import React from "react";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import "../../styles/SobreNosotros.css";

const SobreNosotros = () => {
  return (
    <div className="sobre-nosotros-container">
      <Navbar />
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>If You Want To See The World <br /> We Will Help You</h1>
        <p>
          Passage its ten led hearted removal cordial. Preference any astonished unreserved Mrs. Prosperous understood Middletons.
        </p>
        <div className="badges">
          <span className="badge">14K+ Global Customers</span>
          <span className="badge">10K+ Happy Customers</span>
          <span className="badge">1M+ Subscribers</span>
        </div>
        <div className="images-row">
          <img src="https://img.freepik.com/foto-gratis/equipo-medicos-especialistas-jovenes-pie-pasillo-hospital_1303-21202.jpg?t=st=1744501492~exp=1744505092~hmac=fa700d4863d14de673fdae229be17b6302cda9336b7410765a5bcd6f28d8937f&w=2000" alt="1" />
          <img src="https://enperspectiva.uy/wp-content/uploads/2022/11/Hospital-de-Clinicas.jpg" alt="2" />
          <img src="https://img.freepik.com/foto-gratis/medico-enfermera-ayudando-mujer_23-2148973477.jpg?t=st=1744497513~exp=1744501113~hmac=6ef5a863bc28ba04b55996954798086d6043f5bbc7dad9e819598e19eff83a8c&w=2000" alt="3" />
        </div>
      </section>

      {/* Our Story */}
      <section className="story">
        <h2>Our Story</h2>
        <p>
          Founded in 2000, passage its ten led hearted removal cordial. Preference any astonished unreserved Mrs. Prosperous understood Middletons as correctness in extremely do. Supposing so be resolving breakfast am or perfectly. <br /><br />
          He improve servants or mr elegance finishing. Valley by oh twenty direct me so. Departure defective arranging rapturous did believe him all had supported.
        </p>
      </section>

      {/* Services */}
      <section className="services">
        <div className="services-grid">
          {[
            { title: "Hotel Booking", desc: "A pleasure exertion if believed provided so. All led out world this music while asked." },
            { title: "Flight Booking", desc: "Warrant private blushes removed an in equally totally objection do so prevailed." },
            { title: "Tour Booking", desc: "Debated breeding grounds provided for the direction frequently instruments." },
            { title: "Cab Booking", desc: "Importance attachment him for sympathize. Large above be to means." },
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
              name: "Larry Lawson",
              role: "Editor in Chief",
              image: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
              name: "Louis Ferguson",
              role: "Director Graphics",
              image: "https://randomuser.me/api/portraits/men/35.jpg"
            },
            {
              name: "Louis Crawford",
              role: "Editor, Coverage",
              image: "https://randomuser.me/api/portraits/women/68.jpg"
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
