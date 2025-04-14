
import React, { useState } from "react";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";
import "../../styles/contactanos.css";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import contactImage from "../../img/contactImage.png";

const Contactanos = () => {
  return (
    <div className="sobre-nosotros-container">
      <Navbar />
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <h1>Conectemos y conozcámonos </h1>
          <p>
          Tu opinión es importante para nosotros. Queremos conocerte mejor para poder ofrecerte soluciones personalizadas y adaptadas a tus necesidades. ¡Escríbenos y comencemos una conversación!
          </p>
        </section>

        <section className="services">
          <div className="services-grid">
            {[
              {
                title: "Llámanos",
                desc: "¿Tienes alguna pregunta? ¡Llámanos! ",
                phone1: "+123 456 789",
                phone2: "+(222)4567 586",
              },
              {
                title: "Email",
                desc: "Envíanos tus consultas o comentarios a :",
                email: "somosmedgeek@gmail.com",
              },
              {
                title: "Redes Sociales",
                desc: "¡Conéctate con nosotros en nuestras redes sociales!",
                social: [
                  { name: "Facebook", icon: <FaFacebook /> },
                  { name: "Instagram", icon: <FaInstagram /> },
                  { name: "LinkedIn", icon: <FaLinkedin /> },
                ],
              },
            ].map((item, idx) => {
              if (idx === 0) {
                return (
                  <div className="service-card" key={idx}>
                    <script src="https://animatedicons.co/scripts/embed-animated-icons.js"></script>
                    <animated-icons
                      className="animated-icon-small"
                      src="https://animatedicons.co/get-icon?name=contact&style=minimalistic&token=a95329fc-932a-463b-996b-23c9a6ec0092"
                      trigger="loop"
                      attributes='{"variationThumbColour":"#A4A7A9","variationName":"Gray Tone","variationNumber":3,"numberOfGroups":1,"strokeWidth":1.5,"backgroundIsGroup":true,"defaultColours":{"group-1":"#3E94E6FF","background":"#FFF445FF"}}'
                      style={{ display: "flex", margin: "0 auto" }}
                      height="50"
                      width="50"
                    ></animated-icons>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <p>{item.phone1}</p>
                    <p>{item.phone2}</p>
                  </div>
                );
              } else if (idx === 1) {
                return (
                  <div className="service-card" key={idx}>
                    <script src="https://animatedicons.co/scripts/embed-animated-icons.js"></script>
                    <animated-icons
                      className="animated-icon-small"
                      src="https://animatedicons.co/get-icon?name=mail&style=minimalistic&token=e55f9897-402e-4453-b539-03e933b6d7fa"
                      trigger="loop"
                      attributes='{"variationThumbColour":"#A4A7A9","variationName":"Gray Tone","variationNumber":3,"numberOfGroups":1,"strokeWidth":1.5,"backgroundIsGroup":true,"defaultColours":{"group-1":"#3EA1E6FF","background":"#FB980AB3"}}'
                      style={{ display: "flex", margin: "0 auto" }}
                      height="50"
                      width="50"
                    ></animated-icons>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <p>
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className="service-card" key={idx}>
                    <script src="https://animatedicons.co/scripts/embed-animated-icons.js"></script>
                    <animated-icons
                      className="animated-icon-small"
                      src="https://animatedicons.co/get-icon?name=globe&style=minimalistic&token=7f0645e5-0da7-431e-bc11-b8648b558d8d"
                      trigger="loop"
                      attributes='{"variationThumbColour":"#A4A7A9","variationName":"Gray Tone","variationNumber":3,"numberOfGroups":1,"strokeWidth":1.5,"backgroundIsGroup":true,"defaultColours":{"group-1":"#3EA1E6FF","background":"#27DC06AB"}}'
                      style={{ display: "flex", margin: "0 auto" }}
                      height="50"
                      width="50"
                    ></animated-icons>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="social-icons">
                      {item.social.map((social, socialIdx) => (
                        <a href={`#${social.name.toLowerCase()}`} key={socialIdx}>
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </section>

        <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    terms: false,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTimeout(() => {
      setMessage("¡Mensaje enviado con éxito!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        terms: false,
      });
    }, 1000);
  };

  return (
    <section className="contact-form">
      <div className="form-container">
        <div className="image-container">
          <img src={contactImage} alt="Contact us" />
        </div>
        <div className="form-content">
          <h2>Envíanos un Mensaje</h2>
          {message && <p className="message">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Tu Nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Numero telefonico"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Mensaje"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              Al enviar este formulario estas acordando con los terminos y condiciones.
            </label>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contactanos;