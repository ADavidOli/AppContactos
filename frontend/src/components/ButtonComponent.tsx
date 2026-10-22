
interface ButtonProps {
    status: "eliminar" | "editar",
    onClick: () => void
}

const ButtonComponent = ({ status, onClick}: ButtonProps) => {
    const esEliminar = status === "eliminar";
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-white cursor-pointer transition-colors ${esEliminar
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
        >
            {esEliminar ? "Eliminar" : "Editar"}

        </button>
    )
}

export default ButtonComponent