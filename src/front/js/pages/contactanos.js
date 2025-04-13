import React from "react";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import "../../styles/SobreNosotros.css";

const Contactanos = () => {
  return (
    <div className="sobre-nosotros-container">
      <Navbar />
    <div className="container">
      {/* Hero */}
    <section className="hero">
        <h1>Let's connect and get to know each other <br /> AQUI</h1>
        <p>
          Passage its ten led hearted removal cordial. Preference any astonished unreserved Mrs. Prosperous understood Middletons.
        </p>
        <div className="badges">
          <span className="badge">14K+ Global Customers</span>
          <span className="badge">10K+ Happy Customers</span>
          <span className="badge">1M+ Subscribers</span>
        </div>
    </section>

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
    </div>
    <Footer />
      </div>
      );
    };
    export default Contactanos;