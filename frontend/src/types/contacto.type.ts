export interface DTOContacto {
    // representa los datos que mandamos al backend
    name: string;
    email?: string;
    telefono: string;
}

export interface Contactos extends DTOContacto {
    // representa los datos que recibimos de mongodb
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactoProps {
    contacto: Contactos,
    handleEliminar: (id:string)=> void,
    handleEditar: (id:string)=> void

}

export interface ContactoResponse {
    contactos: Contactos[]
}


export interface contactById {
    contacto: Contactos;
}


export interface FormularioProps {
    contactoInicial?: Contactos
}

