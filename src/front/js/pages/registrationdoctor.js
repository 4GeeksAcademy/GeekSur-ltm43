import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const RegistrationDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        name_especialty: "",
        name_medical_center: "",
        office: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        // Estp sirve para llamar a las acciones para obtener los centros médicos y las especialidades
        actions.getMedicalCenters(); // Carga los centros médicos en el store
        actions.getSpecialties();    // Carga las especialidades en el store
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDoctor = await actions.createDoctor(formData);
            console.log("Doctor creado:", newDoctor);

            setFormData({
                email: "",
                first_name: "",
                last_name: "",
                phone_number: "",
                name_especialty: "",
                name_medical_center: "",
                office: "",
                password: "",
            });

            navigate("/logindoctor"); // si todo sale bien se envia al componente de logindoctor
        } catch (error) {
            console.error("Error al registrar doctor:", error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Nombre" required />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Apellido" required />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                
                {/* aqui podre seleccionar los Centros Médicos Especialidades */}
                <select
                    name="name_especialty"
                    value={formData.name_especialty}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione una especialidad</option>
                    {store.specialties && store.specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.name}>
                            {specialty.name}
                        </option>
                    ))}
                </select>

                {/* <aqui podre seleccionar los Centros Médicos */}
                <select
                    name="name_medical_center"
                    value={formData.name_medical_center}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione un centro médico</option>
                    {store.medicalCenters && store.medicalCenters.map((center) => (
                        <option key={center.id} value={center.name}>
                            {center.name}
                        </option>
                    ))}
                </select>

                <input type="text" name="office" value={formData.office} onChange={handleChange} placeholder="Oficina" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" required />
                <button type="submit">Registrar Doctor</button>
            </form>

            <br />
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>

            <Link to="/logindoctor">
                <button className="btn btn-success">Login</button>
            </Link>
        </div>
    );
};
