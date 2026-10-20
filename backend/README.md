# Gestor de Contactos — Backend 

> **Mi bitácora de aprendizaje.** Este README no es solo para instalar el proyecto: documenta **cómo lo construí desde cero** y por qué organicé el código de esta manera. El frontend con React + TypeScript será la siguiente etapa.

## ¿Qué construí?

Una API REST con **Express + TypeScript + MongoDB/Mongoose** para crear, consultar, actualizar y eliminar contactos. Utilicé `express-validator` para validar las solicitudes y una clase `AppError` para representar errores con códigos HTTP.

**Campos de un contacto:** `name` (obligatorio), `telefono` (obligatorio), `email` (opcional). Mongoose agrega `createdAt` y `updatedAt` al activar `timestamps`.

## Tecnologías utilizadas

- Node.js y npm
- Express
- TypeScript
- MongoDB Atlas y Mongoose
- dotenv, cors y express-validator
- Bruno para probar la API

## Estructura de carpetas

```text
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # Conexión a MongoDB
│   │   └── env.ts                # Variables de entorno
│   ├── controllers/
│   │   └── ContactosController.ts # Recibe peticiones y envía respuestas
│   ├── errors/
│   │   └── AppError.ts           # Errores personalizados
│   ├── middleware/
│   │   └── validator.middleware.ts # Devuelve errores de validación
│   ├── models/
│   │   └── contactos/
│   │       ├── contact.model.ts  # Modelo de Mongoose
│   │       └── contact.schema.ts # Estructura y reglas del contacto
│   ├── routes/
│   │   └── contactos.route.ts    # Define los endpoints
│   ├── services/
│   │   └── contactos.service.ts  # Lógica y consultas a la BD
│   ├── types/
│   │   └── contactos.interface.ts # Interfaces y tipos
│   ├── validators/
│   │   └── contactos.validator.ts # Validaciones de POST/PATCH
│   ├── app.ts                    # Configuración de Express
│   └── server.ts                 # Arranque del servidor
├── .env                          # Secretos (NO subir a Git)
├── .gitignore
├── package.json
└── tsconfig.json
```

## Instalación y configuración desde la creación del proyecto

Estos pasos sirven para **recrear el backend desde cero**, no solamente para ejecutar una copia descargada.

###  Crear la carpeta e iniciar Node.js

```bash
mkdir backend
cd backend
npm init -y
```

**¿Qué aprendí?** `npm init -y` genera `package.json`, donde se registran las dependencias y los scripts.

###  Instalar las dependencias de la aplicación

```bash
npm install express mongoose cors dotenv express-validator
```

- `express`: servidor y rutas HTTP.
- `mongoose`: conexión y operaciones con MongoDB.
- `cors`: permite solicitudes desde el frontend.
- `dotenv`: carga las variables del archivo `.env`.
- `express-validator`: valida los datos recibidos.

###  Instalar TypeScript y herramientas de desarrollo

```bash
npm install -D typescript @types/node @types/express @types/cors tsx
```

`-D` guarda dependencias de desarrollo. `tsx` es **una opción** para ejecutar TypeScript durante el desarrollo; si mi proyecto utiliza otra herramienta, conservo los scripts que ya tengo.

###  Crear y configurar TypeScript

```bash
npx tsc --init
```

Configuración de referencia para `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

Para usar `import`/`export` con `NodeNext`, añadir en `package.json`:

```json
"type": "module"
```

**Recordatorio:** con esta configuración, los imports relativos entre archivos TypeScript se escriben con extensión `.js` (por ejemplo, `import app from "./app.js"`).

###  Configurar scripts y ejecutar

Si utilizo `tsx`, estos scripts son una opción en `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

```bash
npm run dev
```

> Los scripts son **ejemplos reproducibles**. Debo mantener los que correspondan a mi configuración real de `package.json`.


###  Crear las carpetas del backend

```bash
mkdir -p src/{config,controllers,errors,middleware,models/contactos,routes,services,types,validators}
touch src/app.ts src/server.ts
```

La idea es **separar responsabilidades**: la ruta decide qué controlador ejecutar; el controlador gestiona HTTP; el servicio contiene la lógica; el modelo accede a MongoDB.

###  Preparar variables de entorno

Crear `.env` en la raíz de `backend/`:

```env
APP_PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@CLUSTER/BASE_DE_DATOS
```

En `src/config/env.ts`, leer `process.env.APP_PORT` y `process.env.MONGODB_URI`, y validar que exista la URI antes de intentar conectar.

Crear `.gitignore`:

```gitignore
node_modules/
dist/
.env
```

**Nunca subir credenciales reales a GitHub.**

###  Configurar la conexión a MongoDB

En `src/config/database.ts` usar `mongoose.connect(...)` con la URI de entorno. En `server.ts`, **esperar la conexión antes de escuchar peticiones**.

Flujo que seguí:

```text
server.ts
  ├── conecta con MongoDB (database.ts)
  └── si conecta correctamente → app.listen(...)
```

###  Configurar Express en `app.ts`

Registrar `cors()`, `express.json()`, la ruta de salud y las rutas de contactos:

```ts
import express from "express";
import cors from "cors";
import ContactosRouter from "./routes/contactos.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ msg: "API funcionando" });
});

app.use("/api/contactos", ContactosRouter);

export default app;
```

###  Crear el esquema y modelo de contacto

En `contact.schema.ts` definir los campos:

- `name`: `String`, requerido y con `trim`.
- `telefono`: `String`, requerido.
- `email`: `String`, opcional, normalizado a minúsculas.
- `timestamps: true`: agrega fechas de creación y actualización.

En `contact.model.ts`, crear el modelo mediante `model<IContactos>(...)`.

**Nota importante:** para evitar correos duplicados de manera fiable, además de comprobarlos en el servicio, conviene configurar un **índice único parcial** para correos informados. Un índice antiguo con `unique: true` puede requerir ajustes en MongoDB si el correo es opcional.

###  Crear tipos e interfaces

En `src/types/contactos.interface.ts` definí los tipos para los datos de contacto y los parámetros de las rutas (`contactoId`, `DTOContacto`, etc.). También practiqué genéricos de Express para tipar `req.params` y `req.body`.

Ejemplo de lo que quería lograr:

```ts
const { id } = req.params; // id tipado como string
const datos = req.body;    // datos tipados con DTOContacto
```

###  Implementar rutas, controladores y servicios

Para cada operación seguí este recorrido:

```text
Petición HTTP
  → route
  → validator (cuando aplica)
  → controller
  → service
  → Mongoose / MongoDB
  → respuesta JSON
```

**En el servicio** hice consultas como `find()`, `findById()`, `create()`, `findByIdAndUpdate()` y `findByIdAndDelete()`.

**En el controlador** extraje parámetros y datos del body, llamé al servicio y devolví respuestas HTTP.

###  Validar los datos con express-validator

Separé las reglas en `ContactValidator`:

- `saveContacto`: requiere `name` y `telefono`; `email` es opcional pero debe tener formato válido si se proporciona.
- `updateContacto`: permite enviar solamente los campos que quiero modificar (`PATCH`).
- `handleValidationError`: recopila los errores y devuelve una respuesta cuando la petición no cumple las reglas.

**Lo que aprendí:** `.optional()` no es lo mismo que `.notEmpty()`, y `.withMessage()` debe asociarse a un validador como `.isEmail()` o `.notEmpty()`.

###  Manejar errores con `AppError`

Creé una clase personalizada para representar errores de negocio:

```ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}
```

Ejemplos: `404` cuando no existe el contacto y `409` cuando el correo o teléfono ya está registrado. Por ahora, cada controlador utiliza `try/catch`; **un middleware global de errores queda para un proyecto futuro**.


## Endpoints que implementé

URL base de ejemplo: `http://localhost:3000` (cambiar el puerto si `APP_PORT` es diferente).

| Método | Endpoint | ¿Para qué sirve? |
|---|---|---|
| `GET` | `/api/health` | Comprobar que la API responde |
| `GET` | `/api/contactos` | Obtener todos los contactos |
| `GET` | `/api/contactos/:id` | Obtener un contacto por ID |
| `POST` | `/api/contactos/create` | Crear un contacto |
| `PATCH` | `/api/contactos/:id` | Actualizar algunos campos |
| `DELETE` | `/api/contactos/:id` | Eliminar un contacto |

### Ejemplo de creación

```http
POST /api/contactos/create
Content-Type: application/json
```

```json
{
  "name": "Ana López",
  "email": "ana@example.com",
  "telefono": "2281234567"
}
```

### Ejemplo de actualización parcial

```http
PATCH /api/contactos/ID_DEL_CONTACTO
Content-Type: application/json
```

```json
{
  "name": "Ana María López"
}
```

## Pruebas que hice en Bruno

- Crear un contacto con datos válidos.
- Intentar crear contactos con teléfono o correo duplicados.
- Crear un contacto sin correo.
- Obtener todos los contactos y consultar uno por ID.
- Actualizar solo el nombre de un contacto.
- Comprobar validaciones con campos vacíos o formatos incorrectos.
- Eliminar un contacto existente e intentar eliminar uno inexistente.

## Conceptos que quiero recordar

| Concepto | Lo que aprendí |
|---|---|
| `req.params` | Contiene los parámetros de la URL, como `:id` |
| `req.body` | Contiene los datos enviados en JSON |
| `$or` | Permite buscar coincidencias por correo **o** teléfono |
| `findById()` | Busca un documento por su ID |
| `returnDocument: "after"` | Devuelve el documento actualizado |
| `runValidators: true` | Aplica validaciones del esquema al actualizar |
| `404` | Recurso no encontrado |
| `409` | Conflicto, por ejemplo, un duplicado |
| `201` | Recurso creado |
| `200` | Solicitud realizada correctamente |

## Mejoras para otro proyecto

- Middleware global de errores y tratamiento de IDs de MongoDB inválidos.
- Manejo de duplicados también a nivel de índices y errores de MongoDB.
- Validación de que `PATCH` reciba al menos un campo.
- Pruebas automatizadas.
- Documentación OpenAPI/Swagger, si el proyecto lo necesita.

## Siguiente etapa

Construir el **frontend con React + TypeScript**, consumir la API con Axios y practicar `useState`, `useEffect`, formularios controlados, props, estados de carga/error y CRUD desde la interfaz.