import type { ContactoProps } from "../types/contacto.type"


const CotactCard = ({ contacto }: ContactoProps) => {
  return (
    <div
      className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <h3 className="text-lg font-semibold text-gray-800 capitalize">
        {contacto.name}
      </h3>

      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
        <p className="flex items-center gap-1.5">
          <span className="font-medium text-gray-500">Correo:</span>
          <span className="truncate">
            {contacto.email || "Sin correo registrado"}
          </span>
        </p>

        {contacto.telefono && (
          <p className="flex items-center gap-1.5">
            <span className="font-medium text-gray-500">Teléfono:</span>
            <span>{contacto.telefono}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default CotactCard