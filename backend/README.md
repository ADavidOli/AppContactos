# Gestor de Contactos — Backend

API REST para gestionar una agenda de contactos. Este backend permite crear, consultar, actualizar y eliminar contactos, con validación de datos y persistencia en MongoDB.

> **Estado del proyecto:** backend CRUD funcional. El frontend con React y TypeScript se desarrollará como la siguiente etapa.

## Tecnologías

- **Node.js** y **Express** — servidor y rutas HTTP.
- **TypeScript** — tipado estático.
- **MongoDB Atlas** y **Mongoose** — almacenamiento y modelado de datos.
- **express-validator** — validación de solicitudes.
- **CORS** — comunicación con el frontend.

## Funcionalidades

- Crear contactos con nombre y teléfono obligatorios; correo electrónico opcional.
- Consultar todos los contactos o uno mediante su identificador.
- Actualizar parcialmente la información de un contacto.
- Eliminar contactos.
- Comprobar teléfonos duplicados y correos duplicados cuando se proporciona un correo.
- Responder con códigos HTTP apropiados y mensajes de error mediante `AppError`.

## Estructura del backend

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   └── ContactosController.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── middleware/
│   │   └── validator.middleware.ts
│   ├── models/
│   │   └── contactos/
│   │       ├── contact.model.ts
│   │       └── contact.schema.ts
│   ├── routes/
│   │   └── contactos.route.ts
│   ├── services/
│   │   └── contactos.service.ts
│   ├── types/
│   │   └── contactos.interface.ts
│   ├── validators/
│   │   └── contactos.validator.ts
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

## Requisitos

- Node.js y npm instalados.
- Una base de datos MongoDB (por ejemplo, MongoDB Atlas).

## Instalación y configuración

1. Clona el repositorio y entra a la carpeta del backend:

   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>/backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la carpeta `backend`:

   ```env
   APP_PORT=3000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<base_de_datos>
   ```

   Sustituye los valores de ejemplo por los de tu entorno. **No subas el archivo `.env` a GitHub.**

4. Inicia el servidor con el script de desarrollo definido en tu `package.json` (por ejemplo, `npm run dev`, si existe).

## Endpoints

URL base de ejemplo: `http://localhost:3000/api/contactos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Verificar el estado de la API. |
| `GET` | `/api/contactos` | Obtener todos los contactos. |
| `GET` | `/api/contactos/:id` | Obtener un contacto por ID. |
| `POST` | `/api/contactos/create` | Crear un contacto. |
| `PATCH` | `/api/contactos/:id` | Actualizar parcialmente un contacto. |
| `DELETE` | `/api/contactos/:id` | Eliminar un contacto. |

### Crear un contacto

**Petición:** `POST /api/contactos/create`

```json
{
  "name": "Ana López",
  "email": "ana@example.com",
  "telefono": "2281234567"
}
```

El campo `email` es opcional. Para crear un contacto sin correo:

```json
{
  "name": "Luis Pérez",
  "telefono": "2287654321"
}
```

### Actualizar un contacto

**Petición:** `PATCH /api/contactos/:id`

Puedes enviar únicamente los campos que deseas modificar:

```json
{
  "name": "Ana María López"
}
```

### Códigos de respuesta

- `200 OK`: consulta, actualización o eliminación exitosa.
- `201 Created`: contacto creado.
- `404 Not Found`: contacto no encontrado.
- `409 Conflict`: correo o teléfono ya registrado.
- `500 Internal Server Error`: error inesperado del servidor.

Las solicitudes con datos inválidos también son rechazadas por las validaciones de la API.

## Pruebas

Los endpoints se probaron manualmente con **Bruno**, incluyendo operaciones exitosas y casos de error.

## Próximos pasos

- Desarrollar el frontend con **React y TypeScript**.
- Conectar el frontend a la API mediante **Axios**.
- Mejorar el manejo centralizado de errores en futuras versiones.

## Nota

Este proyecto es una práctica de desarrollo full stack. La API implementa las operaciones CRUD principales, pero todavía puede recibir mejoras antes de utilizarse en producción.
