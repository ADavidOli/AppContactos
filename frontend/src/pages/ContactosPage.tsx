import { useState, useEffect } from "react"
import type { Contactos } from "../types/contacto.type"
import CotactCard from "../components/CotactCard";
import { contactoService } from "../services/Contactos.service";



const ContactosPage = () => {
    const [contactos, setContactos] = useState<Contactos[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarContactos = async () => {
            try {
                setCargando(true);
                setError(null);
                // prueba de estilo, esperar 2 segundos más para cargar los datos
                const [datos] = await Promise.all([
                    contactoService.getAll(),
                    new Promise<void>((resolve) =>
                        setTimeout(resolve, 1000)
                    )
                ]);

                setContactos(datos);
            } catch (error) {
                console.error(error);
                setError("Error al cargar la lista de contactos.");
            } finally {
                setCargando(false);
            }
        }
        cargarContactos();
    }, [])

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

    return (
        <>
            <section className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Mis contactos
                </h1>
                {/* renderizado condicional */}
                {contactos.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No hay contactos registrados.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contactos.map((contacto) => (
                            <CotactCard
                                key={contacto._id}
                                contacto={contacto}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}

export default ContactosPage