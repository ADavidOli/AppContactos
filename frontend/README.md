# Gestor de Contactos — Frontend

> **Mi bitácora de aprendizaje:** Este README documenta el proceso de creación del frontend desde cero, las tecnologías utilizadas y las razones por las que decidí organizar el código de esta manera.

## Tecnologías utilizadas

- **React:** biblioteca para construir interfaces de usuario mediante componentes.
- **TypeScript:** permite definir tipos e interfaces para mejorar la seguridad del código.
- **Vite:** herramienta para crear y ejecutar el proyecto durante el desarrollo.
- **Tailwind CSS:** framework CSS para diseñar la interfaz utilizando clases de utilidad.
- **Axios:** biblioteca para realizar peticiones HTTP a nuestra API de Express.

## Instalación y configuración desde la creación del proyecto

Estos pasos sirven para **recrear el frontend desde cero**, no solamente para ejecutar una copia descargada.

### 1. Iniciar el proyecto

Nos ubicamos en la carpeta raíz del proyecto y ejecutamos:

```bash
cd appContactos
npm create vite@latest frontend -- --template react-ts
```

Este comando crea un proyecto de React con TypeScript utilizando Vite.

### 2. Instalar dependencias

Entramos a la carpeta del frontend e instalamos las dependencias necesarias:

```bash
cd frontend
npm install
npm install axios
npm install tailwindcss @tailwindcss/vite
```

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

### 3. Configurar Tailwind CSS

Modificamos el archivo `vite.config.ts` para incorporar el plugin de Tailwind CSS.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ]
});
```

### 4. Limpiar los archivos iniciales

Eliminamos los estilos de ejemplo que genera Vite en `App.css` e `index.css`.

En `index.css` agregamos:

```css
@import "tailwindcss";
```

También limpiamos `App.tsx` para probar que Tailwind funciona correctamente:

```tsx
function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <h1 className="text-4xl font-bold text-blue-600 underline">
        ¡Tailwind funcionando en React!
      </h1>
    </div>
  );
}

export default App;
```

Si aparece el texto centrado, azul y subrayado, Tailwind CSS está funcionando correctamente.

## Organización de carpetas

Para mantener el proyecto organizado, dividiremos el código según su responsabilidad.

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### ¿Para qué sirve cada carpeta?

**`components/` — Componentes reutilizables**

Aquí guardaremos los componentes que forman nuestra interfaz.

Por ejemplo:

- `ListaContactos.tsx`: muestra los contactos registrados.
- `FormularioContacto.tsx`: formulario para crear o editar contactos.
- `ContactoCard.tsx`: representa individualmente un contacto.

Esto permite dividir la interfaz en piezas pequeñas y reutilizables.

**`services/` — Comunicación con el backend**

Aquí colocaremos las funciones que realizan peticiones HTTP mediante Axios.

Por ejemplo, una función para consultar los contactos:

```ts
const getContactos = async () => {
  const response = await axios.get("/api/contactos");
  return response.data;
};
```

La URL deberá configurarse para apuntar a nuestro backend.

La ventaja es que podemos mantener separadas las peticiones HTTP de la lógica visual de los componentes.

**`types/` — Tipos e interfaces de TypeScript**

Aquí definiremos las estructuras de datos que utilizaremos.

Por ejemplo:

```ts
export interface Contacto {
  _id: string;
  name: string;
  email?: string;
  telefono: string;
  createdAt: string;
  updatedAt: string;
}
```

Esto nos permitirá trabajar con contactos tipados y detectar errores durante el desarrollo.

**`assets/` — Recursos estáticos**

Almacenaremos imágenes, iconos u otros recursos que importaremos desde nuestros componentes.

### Archivos principales

**`App.tsx`**

Es el componente principal de nuestra aplicación. Desde aquí organizaremos los componentes que se mostrarán en pantalla.

**`main.tsx`**

Es el punto de entrada de React. Se encarga de renderizar el componente `App` dentro del elemento raíz del HTML.

**`index.css`**

Contiene la importación de Tailwind CSS y, cuando sea necesario, estilos globales.

## ¿Por qué organizar el proyecto así?

Decidí separar el código por responsabilidades para evitar que toda la aplicación esté dentro de `App.tsx`.

Con esta organización podré:

- Reutilizar componentes.
- Mantener las peticiones HTTP separadas de la interfaz.
- Centralizar los tipos de TypeScript.
- Encontrar y corregir errores más fácilmente.
- Agregar nuevas funcionalidades sin desorganizar el proyecto.

Esta estructura es sencilla para el tamaño actual del proyecto y puede ampliarse conforme la aplicación crezca.

---

**Estado actual:** proyecto React + TypeScript creado con Vite, Tailwind CSS configurado y estructura inicial definida.

**Siguiente etapa:** implementar la lista de contactos y posteriormente conectarla con la API REST del backend.
