import { model, } from "mongoose";
import type { IContactos } from "../../types/contactos.interface.js";
import { constactosSchema } from "./contact.schema.js";


export const ContactosModel = model<IContactos>('Contactos', constactosSchema);