import express from "express";
import cors from "cors";
import ContactosRouter from './routes/contactos.route.js'

const app = express();

// configurando app
app.use(cors());
app.use(express.json());


// respuesta de vida del servidor
app.get("/api/health", (_req, res)=>{
    res.json({
        status: "ok",
        message: "Gestor de contactos funcionando"
    });
})
// uso de rutas
app.use("/api/contactos", ContactosRouter);





export default app;