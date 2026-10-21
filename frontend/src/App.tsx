import { Route, Routes, BrowserRouter } from "react-router";
import ContactosPage from "./pages/ContactosPage";
import CrearContacto from "./pages/CrearContacto";
import MainLayout from "./layouts/MainLayout";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>} >
          <Route index element={<ContactosPage/>}/>
          <Route path="/crear" element={<CrearContacto/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
