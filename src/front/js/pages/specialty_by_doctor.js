import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const SpecialtyByDoctor = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name_especialty: "",
        });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        // Estp sirve para llamar a las acciones para obtener las especialidades
        actions.getSpecialties();    // Carga las especialidades en el store
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDoctor = await actions.createDoctor(formData);
            console.log("Doctor creado:", newDoctor);

            setFormData({
                name_especialty: "",
            });

            navigate("/center_office_by_doctor"); // se debe diriguir a elegir su CM y Oficina
        } catch (error) {
            console.error("Error al registrar doctor:", error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                                
                {/* aqui podre seleccionar las Especialidades */}
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

                <button type="submit">Agregar </button>
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
