import type { Request, Response } from "express";
import type { Body, Params, Req } from "../types/request.types.js";
import type { DTOContacto, contactoId } from "../types/contactos.interface.js";
import { contactosService } from "../services/Contactos.service.js";
import { AppError } from "../errors/AppError.js";

export class contactosController {
    static async getContactos(req: Request, res: Response) {
        try {
            const contactos = await contactosService.getContactos();
            return res.status(200).json({
                contactos
            })
        } catch (error) {
            return res.status(500).json({
                msg: error instanceof Error ? error.message : "Error interno"
            })
        }
    }
    static async getContacto(req:Params<contactoId>, res:Response) {
        try {
            const {id} = req.params;
            const contacto = await contactosService.getContacto({id});
           return res.status(200).json({
                contacto
            })
        } catch (error) {

            if(error instanceof AppError){
                  return res.status(error.statusCode).json({
                    msg: error.message
                })
            }
            return res.status(500).json({
                msg: error instanceof Error ? error.message : "Error interno"
            })
        }

    }
    static async createContacto(req:Body<DTOContacto>, res: Response) {
        try {
            const contacto = req.body;
            const nuevoContacto = await contactosService.createContacto(contacto);

            return res.status(201).json({
                msg: "contacto creado",
                nuevoContacto
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    msg: error.message
                })
            }
            return res.status(500).json({
                msg: error instanceof Error ? error.message : "Error interno"
               
            })
        }
    }
    static async updateContacto(req:Req<contactoId, DTOContacto> ,res:Response) {
        try {
            const {id} = req.params;
            const updateContacto = await contactosService.updateContacto({id}, req.body);
            return res.status(200).json({
                msg: "contacto actualizado",
                updateContacto
            })

            
        } catch (error) {
            if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    msg: error.message
                })
            }
            return res.status(500).json({
                msg: error instanceof Error ? error.message : "Error interno"
            })
        }

    }
    static async deleteContacto(req:Params<contactoId>, res:Response) {
        const {id} = req.params;
        try {
            const deleteContacto = await contactosService.deleteContacto({id});
            return res.status(200).json({
                msg: "contacto eliminado correctamente",
                deleteContacto
            })
            
        } catch (error) {
            if(error instanceof AppError){
                return res.status(error.statusCode).json({
                    msg: error.message
                })
            }
            return res.status(500).json({
                msg: error instanceof Error ? error.message : "Error interno"
            })
        }
    }
}