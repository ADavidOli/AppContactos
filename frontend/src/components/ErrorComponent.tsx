import type { MessageProps } from "../types/component.Type"

const ErrorComponent = ({mensaje}:MessageProps) => {
    return (
        <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
            {mensaje}
        </div>

    )
}

export default ErrorComponent