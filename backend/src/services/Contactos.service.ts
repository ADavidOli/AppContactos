import { AppError } from "../errors/AppError.js";
import { ContactosModel } from "../models/contactos/contact.model.js";
import type { contactoId, DTOContacto } from "../types/contactos.interface.js";

export class contactosService {
    static async getContactos() {

        const contactos = await ContactosModel.find();
        return contactos;

    }

    static async createContacto(contacto: DTOContacto) {
        const newContacto = await ContactosModel.findOne({telefono: contacto.telefono});
        if (newContacto) {
            throw new AppError(409, "El contacto ya están registrados");
        }

        return await ContactosModel.create(contacto);
    }


    static async getContacto(data: contactoId) {
        const obtenerContacto = await ContactosModel.findById({ _id: data.id });
        if (!obtenerContacto) {
            throw new AppError(404, "No existe un contacto registrado")
        }
        return obtenerContacto;

    }
    static async updateContacto(data: contactoId, contacto: DTOContacto) {
        const { id } = data;
        const update = await ContactosModel.findOneAndUpdate({ _id: id }, contacto, {
            returnDocument: 'after',
            runValidators: true
        })

        if (!update) {
            throw new AppError(404, "No existe un contacto registrado");
        }

        return update
    }

    static async deleteContacto(data: contactoId) {
        const { id } = data;
        const deleteContacto = await ContactosModel.findOneAndDelete({ _id: id });
        if (!deleteContacto) {
            throw new AppError(404, "no existe un contacto con ese identificador para eliminar")
        }
        return deleteContacto;
    }
}