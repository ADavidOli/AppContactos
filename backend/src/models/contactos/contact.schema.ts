import mongoose from "mongoose";
import type { IContactos } from "../../types/contactos.interface.js";

const { Schema } = mongoose;

export const constactosSchema = new Schema<IContactos>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// crear un indice parcial para email. y así aceptar el no tener un email o sí, que sea unique
constactosSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: {
            email: { $type: "string", $gt: "" }
        }
    }
);