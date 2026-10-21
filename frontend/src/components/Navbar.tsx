import { NavLink } from "react-router";

export const Navbar = () => {
    const estiloLink = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-blue-400 font-semibold"
            : "text-gray-300 hover:text-white";

    return (
        <nav className="bg-slate-800 text-white p-4 flex justify-between">
            <h1 className="font-bold">Gestor de Contactos</h1>

            <div className="flex gap-4">
                <NavLink to="/" end className={estiloLink}>
                    Mis contactos
                </NavLink>

                <NavLink to="/crear" className={estiloLink}>
                    Crear contacto
                </NavLink>
            </div>
        </nav>
    );
};