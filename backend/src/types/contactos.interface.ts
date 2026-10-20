
export type IContactos  = {
    name: string,
    email: string,
    telefono: string,
    createdAt: Date
}

export type contactoId ={id: string}
export type DTOContacto = Pick<IContactos, "name" | "email" | "telefono">