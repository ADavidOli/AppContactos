import api from "../api/AxiosClient";
import type { contactById, ContactoResponse, Contactos, DTOContacto } from "../types/contacto.type";
import type { AxiosTypeError } from "../types/component.Type";
import axios from "axios";

export const contactoService = {
    getAll: async () => {
        try {
            const response = await api.get<ContactoResponse>("/contactos");
            return response.data.contactos;

        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                console.error("Mensaje:", error.response?.data.msg);
                console.error("Estado:", error.response?.status);
            }

            throw error;
        }
    },
    create: async (contacto: DTOContacto) => {
        try {
            const response = await api.post("/contactos/create", contacto)
            return response.data
        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                console.error("Mensaje", error.response?.data.msg);
                console.error("Estado", error.response?.status);
            }
            throw error
        }
    },
    delete: async (id: string) => {
        try {
            const response = await api.delete(`/contactos/${id}`);
            return response.data

        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                console.log("Mensaje:", error.response?.data.msg);
                console.log("Status:", error.response?.status);
            }
            throw error
        }
    },
    update: async (id: string, contacto: Partial<DTOContacto>) => {
        try {
            const response = await api.patch(`/contactos/${id}`, contacto);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                console.log("Mensaje:", error.response?.data.msg);
                console.log("Status:", error.response?.status);
            }
            throw error
        }
    },
    getById: async (id: string): Promise<Contactos> => {
        try {
            const response = await api.get<contactById>(`/contactos/${id}`);
            return response.data.contacto;
        } catch (error) {
            if (axios.isAxiosError<AxiosTypeError>(error)) {
                console.log("Mensaje:", error.response?.data.msg);
                console.log("Status:", error.response?.status);
            }
            throw error
        }
    }
}