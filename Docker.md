# Bitácora de aprendizaje: Docker con appContactos

## 1. Objetivo

Dockerizar el proyecto **appContactos**, compuesto por un frontend desarrollado con React + TypeScript y un backend con Node.js, Express, TypeScript y MongoDB.

El objetivo fue aprender a:

- Crear imágenes mediante Dockerfiles.
- Ejecutar contenedores.
- Configurar puertos y variables de entorno.
- Utilizar Nginx para servir el frontend y comunicarse con el backend.
- Orquestar servicios con Docker Compose.
- Administrar contenedores mediante Portainer y Lazydocker.

## 2. Arquitectura del proyecto

La aplicación quedó organizada de la siguiente manera:

```text
appContactos/
├── backend/
│   ├── src/
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   ├── .dockerignore
│   ├── Dockerfile
│   └── nginx.conf
│
└── compose.yaml
```

### Servicios

| Servicio | Tecnología | Función |
|---|---|---|
| Frontend | React, Vite y Nginx | Servir la interfaz web |
| Backend | Node.js y Express | Procesar las peticiones HTTP |
| Base de datos | MongoDB Atlas | Almacenar los contactos |

MongoDB Atlas permanece como un servicio externo, por lo que no fue necesario crear un contenedor para la base de datos.

## 3. Dockerizar el backend

### 3.1. Crear el Dockerfile

Se creó `backend/Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 3.2. Explicación

- `FROM node:22-alpine`: utiliza una imagen de Node.js basada en Alpine Linux.
- `WORKDIR /app`: establece el directorio de trabajo.
- `COPY package*.json ./`: copia los archivos de configuración de npm.
- `RUN npm install`: instala las dependencias, incluidas las necesarias para compilar TypeScript.
- `COPY tsconfig.json ./`: copia la configuración de TypeScript.
- `COPY src ./src`: copia el código fuente.
- `RUN npm run build`: compila TypeScript y genera los archivos JavaScript en `dist/`.
- `EXPOSE 3000`: documenta el puerto que utiliza la aplicación.
- `CMD ["npm", "start"]`: inicia el backend usando el script `start` de `package.json`.

El script de inicio del backend es:

```json
"start": "node dist/server.js"
```

### 3.3. Crear `.dockerignore`

Se creó `backend/.dockerignore`:

```text
node_modules
dist
.env
.git
```

Este archivo evita incluir archivos innecesarios en el contexto de construcción. En particular, `.env` no se copia a la imagen.

### 3.4. Construir la imagen

Desde la carpeta `backend`:

```bash
docker build -t appcontactos-backend .
```

La opción `-t` permite asignar un nombre a la imagen, mientras que `.` indica que la carpeta actual es el contexto de construcción.

### 3.5. Ejecutar el contenedor

Para probar el backend de manera independiente:

```bash
docker run --name appcontactos-api \
  -p 3000:3000 \
  --env-file .env \
  appcontactos-backend
```

Explicación:

- `--name`: asigna un nombre al contenedor.
- `-p 3000:3000`: publica el puerto 3000 del contenedor en el puerto 3000 del host.
- `--env-file .env`: proporciona las variables de entorno.
- `appcontactos-backend`: indica qué imagen utilizar.

Las credenciales de MongoDB Atlas se mantienen fuera de la imagen.

## 4. Dockerizar el frontend

### 4.1. Configurar Axios

En `frontend/src/api/AxiosClient.ts`, se estableció una URL relativa:

```typescript
const api: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});
```

Esto permite que el navegador envíe las peticiones al mismo origen del frontend. Nginx se encarga de redirigirlas al backend.

### 4.2. Crear el Dockerfile

Se creó `frontend/Dockerfile`:

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4.3. Entender las dos etapas

**Primera etapa: construcción**

La imagen de Node.js instala las dependencias y ejecuta `npm run build`. Vite genera los archivos estáticos de React en `dist/`.

**Segunda etapa: ejecución**

La imagen de Nginx recibe los archivos compilados y los sirve al navegador.

Esta técnica se conoce como *multi-stage build*. Permite utilizar Node.js durante la construcción sin necesitarlo para servir los archivos estáticos en producción.

### 4.4. Configurar Nginx

Se creó `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000/api/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Responsabilidades de esta configuración:

- `listen 80`: escucha en el puerto 80 del contenedor.
- `root`: establece dónde se encuentran los archivos estáticos.
- `try_files`: permite que las rutas de React Router funcionen al acceder directamente a ellas.
- `location /api/`: identifica las peticiones destinadas al backend.
- `proxy_pass`: reenvía las peticiones al servicio `backend` en el puerto 3000.

El nombre `backend` corresponde al servicio definido en Docker Compose. Docker permite que los servicios de la misma red se comuniquen utilizando sus nombres de servicio.

### 4.5. Crear `.dockerignore`

Se creó `frontend/.dockerignore`:

```text
node_modules
dist
.env
.git
```

Esto evita copiar dependencias locales, archivos compilados y archivos de entorno innecesarios al contexto de construcción.

## 5. Orquestar los servicios con Docker Compose

En la raíz del proyecto se creó `compose.yaml`:

```yaml
services:
  backend:
    build:
      context: ./backend
    env_file:
      - ./backend/.env
    expose:
      - "3000"
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### 5.1. Explicación de la configuración

- `services`: declara los servicios de la aplicación.
- `build.context`: indica la carpeta que contiene el Dockerfile.
- `env_file`: proporciona al backend las variables del archivo `.env`.
- `expose`: documenta y habilita el puerto del backend para la comunicación entre servicios, sin publicarlo directamente en el host.
- `ports`: publica el puerto 80 del frontend en el puerto 8080 del host.
- `depends_on`: establece el orden básico de inicio de los servicios.
- `restart: unless-stopped`: permite reiniciar automáticamente los contenedores en determinadas situaciones, salvo que se hayan detenido manualmente.

Importante: `depends_on` por sí solo no garantiza que el backend esté listo para recibir peticiones cuando el frontend inicia.

### 5.2. Validar la configuración

Desde la raíz del proyecto:

```bash
docker compose config
```

Este comando permite validar y visualizar la configuración final de Compose.

### 5.3. Iniciar la aplicación

```bash
docker compose up --build
```

Este comando construye las imágenes necesarias y crea e inicia los contenedores de los servicios.

El frontend queda accesible en:

`http://localhost:8080`

El flujo de comunicación es:

1. El navegador solicita la página al frontend.
2. Nginx entrega los archivos de React.
3. Cuando React solicita datos mediante `/api`, Nginx reenvía la petición al backend.
4. Express procesa la petición y consulta MongoDB Atlas.
5. La respuesta vuelve al navegador.

## 6. Comandos importantes de Docker

| Comando | Función |
|---|---|
| `docker images` | Lista las imágenes disponibles |
| `docker ps` | Muestra los contenedores en ejecución |
| `docker ps -a` | Muestra todos los contenedores, incluidos los detenidos |
| `docker logs appcontactos-api` | Consulta los logs de un contenedor |
| `docker rm appcontactos-api` | Elimina un contenedor detenido |
| `docker rm -f appcontactos-api` | Fuerza la eliminación del contenedor |
| `docker compose config` | Valida y muestra la configuración de Compose |
| `docker compose up --build` | Construye las imágenes e inicia los servicios |
| `docker compose down` | Detiene y elimina los contenedores y la red del proyecto |
| `docker compose logs -f` | Sigue los logs de los servicios |

Los comandos de Docker Compose deben ejecutarse desde la carpeta que contiene `compose.yaml`, salvo que se indique otra ruta mediante opciones.

## 7. Problemas encontrados y soluciones

### Error: imagen no encontrada

Mensaje:

```text
Unable to find image 'appcontactos-backend:latest' locally
```

Causa probable: la imagen no se había construido con ese nombre o la construcción no había finalizado correctamente.

Solución:

```bash
docker images
docker build -t appcontactos-backend .
```

### Error: puerto ocupado

Mensaje:

```text
failed to bind host port 0.0.0.0:3000
```

Causa: otro proceso, como el backend ejecutado con `npm run dev`, ya utilizaba el puerto 3000 del host.

Solución: detener el servidor local con `Ctrl + C` o publicar el contenedor en otro puerto del host.

### Error: nombre de contenedor en uso

Mensaje:

```text
The container name "/appcontactos-api" is already in use
```

Causa: Docker conserva los contenedores detenidos.

Solución, cuando se quiere reemplazar el contenedor de prueba:

```bash
docker rm appcontactos-api
```

Si sigue en ejecución:

```bash
docker rm -f appcontactos-api
```

Estos comandos eliminan el contenedor, no la imagen ni los datos almacenados en MongoDB Atlas.

## 8. Administración gráfica

### Portainer

Se instaló Portainer Community Edition para administrar Docker desde el navegador.

Permite consultar:

- Contenedores.
- Imágenes.
- Redes.
- Volúmenes.
- Logs.

Una aplicación desplegada mediante Compose puede administrarse como un stack.

### Lazydocker

También se instaló Lazydocker para administrar Docker desde la terminal.

Es útil para consultar rápidamente contenedores, imágenes, redes, volúmenes y logs mediante una interfaz interactiva.

Ambas herramientas complementan los comandos de Docker; no los reemplazan.

## 9. Conceptos aprendidos

**Imagen:** plantilla de solo lectura a partir de la cual se crean contenedores.

**Contenedor:** instancia ejecutable de una imagen.

**Dockerfile:** archivo que define los pasos para construir una imagen.

**Docker Compose:** herramienta para definir y administrar varios servicios mediante un archivo YAML.

**Stack:** conjunto de servicios administrados como una aplicación mediante una configuración de Compose en Portainer.

**Puerto publicado:** conecta un puerto del host con un puerto del contenedor.

**Red de Docker:** permite que los servicios se comuniquen entre sí.

**Volumen:** mecanismo para conservar datos fuera del ciclo de vida de un contenedor.

**Nginx:** servidor web utilizado en este proyecto para servir el frontend y actuar como proxy inverso.

**Multi-stage build:** técnica que permite separar la etapa de construcción de la etapa de ejecución.

## 10. Buenas prácticas y siguientes pasos

- No incluir archivos `.env` ni credenciales en las imágenes.
- Mantener los archivos `.dockerignore` actualizados.
- No publicar puertos internos que no necesiten acceso desde el host.
- Evitar exponer la interfaz de administración de Docker directamente a Internet.
- Aprender a utilizar volúmenes cuando se administren bases de datos dentro de contenedores.
- Practicar redes, variables de entorno, registros y políticas de reinicio.
- Más adelante, estudiar imágenes de producción más pequeñas, usuarios no privilegiados, gestión de secretos y comprobaciones de salud (*healthchecks*).

## Conclusión

Con este ejercicio se dockerizó el frontend y el backend de `appContactos`, se conectaron mediante Nginx y Docker Compose, y se verificó su funcionamiento con MongoDB Atlas.

El proyecto constituye una primera práctica para comprender cómo desplegar aplicaciones con varios servicios y cómo administrarlas mediante Docker, Portainer y Lazydocker.
