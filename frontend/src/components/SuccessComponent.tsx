import type { MessageProps } from "../types/component.Type"

const SuccessComponent = ({ mensaje }: MessageProps) => {
    return (
          <div
            role="status"
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
        >
            {mensaje}
        </div>
    )
}

export default SuccessComponent