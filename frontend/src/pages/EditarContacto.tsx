import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { contactoService } from "../services/Contactos.service";
import type { Contactos } from "../types/contacto.type";
import FormularioContacto from "../components/FormularioContacto";


const EditarContacto = () => {

    const { id } = useParams<{ id: string }>();
    const [contacto, setContacto] = useState<Contactos | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const cargarContacto = async () => {

            if (!id) {
                setError("No se proporcionó un ID.");
                setCargando(false);
                return;
            }

            try {
                const response = await contactoService.getById(id);
                setContacto(response)
            } catch (error) {
                console.error(error)
                setError("No se pudo cargar el contacto")
            }
            finally {
                setCargando(false)
            }
        }
        cargarContacto();
    }, [id])

    if (cargando) {
        return (
            // estilo en tailwind animacion de carga
            <div className="flex flex-col items-center justify-center p-12 gap-4">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

                <p className="text-gray-500">
                    Cargando contactos...
                </p>
            </div>
        );
    }
    if (error) {
        return (
            <div
                role="alert"
                className="max-w-lg mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
                <h3 className="text-red-700 font-semibold">
                    Ocurrió un error
                </h3>

                <p className="text-red-600 text-sm mt-1">
                    {error}
                </p>
            </div>
        );
    }
    if (!contacto) {
        return <p>No se encontró el contacto.</p>;
    }

    return (

        <section className="max-w-xl mx-auto mt-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Editar Contacto
            </h1>

            <p className="text-gray-500 mb-6">
                Completa los datos para actualizar tu contacto.
            </p>

            <FormularioContacto contactoInicial={contacto} />
        </section>



        // <div>
        //     <h1>Editar contacto</h1>
        //     <p>Nombre: {contacto?.name}</p>
        //     <p>Correo: {contacto?.email}</p>
        //     <p>Teléfono: {contacto?.telefono}</p>
        // </div>
    )
}

export default EditarContacto