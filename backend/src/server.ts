import app from "./app.js";
import { env } from "./config/env.js";
import { conectDB } from "./config/database.js";

// funcion para arrancar el servidor
async function startServer(): Promise<void> {
    try {
        await conectDB();
        
        app.listen(env.PORT, () => {
            console.log(`servidor funcionando en el puerto ${env.PORT}`);
        })
    } catch (error) {
        console.log(error, "error al iniciar el servidor")
    }
}

startServer();

