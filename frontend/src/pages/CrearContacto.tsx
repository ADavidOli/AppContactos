import FormularioContacto from "../components/FormularioContacto"

const CrearContacto = () => {
    return (
        <>
            <section className="max-w-xl mx-auto mt-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Crear contacto
                </h1>

                <p className="text-gray-500 mb-6">
                    Completa los datos para registrar un nuevo contacto.
                </p>

                <FormularioContacto />
            </section>
        </>
    )
}

export default CrearContacto