// import React, { useContext, useState } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import logo from "../../img/meedgeeknegro.png";
// import "../../styles/signup.css";

// export const RegistrationDoctor = () => {
//     const { actions } = useContext(Context);
//     const navigate = useNavigate();
//     const [error, setError] = useState("");
//     const [formData, setFormData] = useState({
//         email: "",
//         first_name: "",
//         last_name: "",
//         phone_number: "",
//         password: "",
//     });
//     const [photo, setPhoto] = useState(null); // Estado para la imagen

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleFileChange = (e) => {
//         setPhoto(e.target.files[0]); // Guardar el archivo seleccionado
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const data = new FormData();
//             data.append("email", formData.email);
//             data.append("first_name", formData.first_name);
//             data.append("last_name", formData.last_name);
//             data.append("phone_number", formData.phone_number);
//             data.append("password", formData.password);
//             if (photo) {
//                 data.append("photo", photo); // Agregar la imagen al FormData
//             }

//             const newDoctor = await actions.createDoctor(data);
//             console.log("Doctor creado:", newDoctor);

//             setFormData({
//                 email: "",
//                 first_name: "",
//                 last_name: "",
//                 phone_number: "",
//                 password: "",
//             });
//             setPhoto(null); // Limpiar el campo de la imagen
//             navigate("/logindoctor");
//         } catch (error) {
//             setError(error.message || "Error al registrar doctor");
//             console.error("Error al registrar doctor:", error.message);
//         }
//     };

//     return (
//         <div className="container">

//             <div className="left">
//                 <div className="signup-info">
//                     <div className="logo-container">
//                         <img src={logo} alt="MedGeek Logo" className="logo" />
//                     </div>

//                 </div>
//             </div>


//             <div className="right">

//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleChange}
//                     placeholder="Nombre"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleChange}
//                     placeholder="Apellido"
//                     required
//                 />
//                 <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Email"
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="phone_number"
//                     value={formData.phone_number}
//                     onChange={handleChange}
//                     placeholder="Teléfono"
//                     required
//                 />
//                 <input
//                     type="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     placeholder="Contraseña"
//                     required
//                 />
//                 <div>
//                     <label>Foto de perfil:</label>
//                     <input
//                         type="file"
//                         name="photo"
//                         onChange={handleFileChange}
//                         accept="image/*"
//                     />
//                 </div>
//                 <button type="submit">Guardar</button>
//             </form>

//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <br />
//             <Link to="/">
//                 <button className="btn btn-primary">Home</button>
//             </Link>


//         </div>
//         </div>
//     );
// };

import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../img/meedgeeknegro.png";
import "../../styles/signup.css";

export const RegistrationDoctor = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
    });
    const [photo, setPhoto] = useState(null); // Estado para la imagen

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]); // Guardar el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("first_name", formData.first_name);
            data.append("last_name", formData.last_name);
            data.append("phone_number", formData.phone_number);
            data.append("password", formData.password);
            if (photo) {
                data.append("photo", photo); // Agregar la imagen al FormData
            }

            const newDoctor = await actions.createDoctor(data);
            console.log("Doctor creado:", newDoctor);

            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                password: "",
            });
            setPhoto(null); // Limpiar el campo de la imagen
            navigate("/logindoctor");
        } catch (error) {
            setError(error.message || "Error al registrar doctor");
            console.error("Error al registrar doctor:", error.message);
        }
    };

    return (
        <div className="container">
            <div className="left">
                <div className="signup-info">
                    <div className="logo-container">
                        <img src={logo} alt="MedGeek Logo" className="logo" />
                    </div>
                </div>
            </div>

            <div className="right">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
                    <input
                        className="signup-form-input"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Apellido"
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        required
                    />
                    <input
                        className="signup-form-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                    />
                    <div className="signup-form-input">
                        <label>Foto de perfil:</label>
                        <input
                            className="signup-form-input"
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" className="signup-form-button">Guardar</button>
                        <Link to="/">
                            <button className="signup-form-button">Home</button>
                        </Link>
                    </div>
                </form>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
        </div>
    );
};
