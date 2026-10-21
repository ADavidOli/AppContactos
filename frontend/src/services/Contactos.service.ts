import api from "../api/AxiosClient";
import type { ContactoResponse, DTOContacto } from "../types/contacto.type";
import type { AxiosTypeError } from "../types/component.Type";
import  axios  from "axios";

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
    create: async (contacto:DTOContacto) => {
        try {
            const response = await api.post("/contactos/create",contacto)
            return response.data
        } catch (error) {
            if(axios.isAxiosError<AxiosTypeError>(error)){
                console.error("Mensaje", error.response?.data.msg);
                console.error("Estado", error.response?.status);
            }
            throw error
        }
    }
}