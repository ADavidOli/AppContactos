import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router";



const MainLayout = () => {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 p-6">
                <Outlet />
            </main>
        </>
    )
}

export default MainLayout