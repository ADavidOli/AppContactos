import { useState, useEffect } from "react"
import { useNavigate } from "react-router";
import axios from "axios";

import SuccessComponent from "./SuccessComponent";
import ErrorComponent from "./ErrorComponent";

import type { DTOContacto } from "../types/contacto.type";
import type { AxiosTypeError } from "../types/component.Type";
import { contactoService } from "../services/Contactos.service";

const FormularioContacto = () => {

    const [nombre, setNombre] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [guardando, setGuardando] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate()


    useEffect(() => {
        if (!error && !success) return;

        const timer = setTimeout(() => {
            if (success) {
                setNombre("");
                setEmail("");
                setTelefono("");
                navigate("/");
            }

            setError(null);
            setSuccess(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [error, success, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nuevoContacto: DTOContacto = {
            name: nombre,
            email: email,
            telefono: telefono
        };
        try {
            setGuardando(true);
            setError(null);
            setSuccess(null);

            const response = await contactoService.create(nuevoContacto);
            setSuccess(response.msg)
            // navigate('/')

        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                if (error.response?.status === 409) {
                    setError(error.response.data?.msg ?? "El contacto ya existe.");
                } else {
                    setError(error.response?.data?.msg ?? "No se pudo registrar el contacto.");
                }
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setGuardando(false);
        }

    }


    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-5"
        >
            {error && <ErrorComponent mensaje={error} />}

            {success && <SuccessComponent mensaje={success} />}
            <div>
                <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Nombre
                </label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Escribe el nombre del contacto"
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Correo electrónico
                    <span className="text-gray-400 font-normal"> (opcional)</span>
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            <div>
                <label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Teléfono
                </label>
                <input
                    id="telefono"
                    type="tel"
                    placeholder="Escribe el teléfono del contacto"
                    value={telefono}
                    onChange={(event) => setTelefono(event.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            <button
                type="submit"
                disabled={guardando}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
            >
                {guardando ? "Guardando..." : "Guardar contacto"}
            </button>
        </form>
    );

}

export default FormularioContacto