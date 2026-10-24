# Gestor de contactos — Frontend

## Mi bitácora de aprendizaje

Este proyecto forma parte de mi proceso de aprendizaje de React y TypeScript. El objetivo fue desarrollar una interfaz para gestionar contactos e integrar el frontend con una API REST creada previamente con Express, TypeScript y MongoDB.

El proyecto se mantuvo intencionalmente pequeño para reforzar los fundamentos de React, practicar la organización del código y comprender cómo se comunican el frontend y el backend.

---

## 1. Tecnologías utilizadas

- **React:** construcción de interfaces mediante componentes.
- **TypeScript:** tipado estático y definición de interfaces.
- **Vite:** creación y ejecución del entorno de desarrollo.
- **Tailwind CSS:** estilos y diseño de la interfaz.
- **React Router:** navegación entre páginas.
- **Axios:** comunicación HTTP con el backend.
- **Express + TypeScript:** API REST del proyecto.
- **MongoDB + Mongoose:** almacenamiento y gestión de los contactos.

---

## 2. Creación del proyecto

Para crear el frontend utilicé Vite con la plantilla de React y TypeScript.

```bash
npm create vite@latest frontend -- --template react-ts
```

Entré en la carpeta del proyecto:

```bash
cd frontend
```

Instalé las dependencias iniciales:

```bash
npm install
```

Instalé Axios para realizar peticiones HTTP:

```bash
npm install axios
```

Instalé Tailwind CSS y su plugin para Vite:

```bash
npm install tailwindcss @tailwindcss/vite
```

Finalmente, inicié el servidor de desarrollo:

```bash
npm run dev
```

### Configuración de Tailwind CSS

Se configuró el plugin de Tailwind CSS en Vite y se importó Tailwind en la hoja de estilos principal.

Esta configuración permite utilizar clases de utilidad directamente en los componentes JSX, por ejemplo:

```tsx
<div className="rounded-xl bg-white p-6 shadow-md">
  Contenido del componente
</div>
```

---

## 3. Organización del proyecto

La estructura principal del frontend quedó organizada de la siguiente manera:

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── AxiosClient.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── CotactCard.tsx
│   │   ├── ButtonComponent.tsx
│   │   ├── FormularioContacto.tsx
│   │   ├── SuccessComponent.tsx
│   │   └── ErrorComponent.tsx
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── ContactosPage.tsx
│   │   ├── CrearContacto.tsx
│   │   └── EditarContacto.tsx
│   ├── services/
│   │   └── Contactos.service.ts
│   ├── types/
│   │   └── contacto.type.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── vite.config.ts
```

### Responsabilidad de cada carpeta

- **api:** configuración de Axios para centralizar la comunicación con el backend.
- **components:** componentes reutilizables de la interfaz.
- **layouts:** estructura visual compartida entre las páginas.
- **pages:** páginas que representan las diferentes vistas de la aplicación.
- **services:** funciones encargadas de realizar las peticiones a la API.
- **types:** interfaces y tipos de TypeScript utilizados en el proyecto.

La intención de esta organización es mantener separadas las responsabilidades y evitar concentrar toda la lógica en un solo componente.

---

## 4. Configuración de Axios

Creé una instancia de Axios en `src/api/AxiosClient.ts` para centralizar la configuración de las peticiones HTTP.

```ts
import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

### ¿Qué aprendí?

- `axios.create()` permite definir una configuración reutilizable.
- `baseURL` establece la dirección base de la API.
- `timeout` limita el tiempo de espera de una petición.
- Los encabezados permiten indicar el tipo de contenido enviado.

La dirección utilizada corresponde al entorno local de desarrollo.

---

## 5. Tipado con TypeScript

Creé interfaces para representar los datos que utiliza el frontend.

Entre ellas se encuentran:

- `DTOContacto`: datos necesarios para crear o actualizar un contacto.
- `Contactos`: representa un contacto recibido del backend, incluyendo su identificador.
- `ContactoProps`: define las propiedades que recibe el componente de la tarjeta.
- `ContactoResponse`: representa la respuesta de la API al solicitar la lista de contactos.
- `ContactoByIdResponse`: representa la respuesta al solicitar un contacto específico.
- `FormularioProps`: define las propiedades que recibe el formulario reutilizable.

### ¿Qué aprendí?

Las interfaces permiten describir la estructura de los datos y detectar incompatibilidades durante el desarrollo.

También comprendí que los datos enviados al backend no siempre tienen la misma estructura que los datos recibidos. Por ejemplo, el DTO de creación no necesita incluir el `_id` generado por MongoDB.

---

## 6. Servicios de contactos

En `src/services/Contactos.service.ts` centralicé las operaciones de comunicación con la API.

Las principales operaciones son:

| Método del servicio | Operación HTTP | Función |
| --- | --- | --- |
| `getAll()` | GET | Obtener todos los contactos |
| `getById(id)` | GET | Obtener un contacto por su ID |
| `create(contacto)` | POST | Crear un contacto |
| `update(id, contacto)` | PATCH | Actualizar un contacto |
| `delete(id)` | DELETE | Eliminar un contacto |

### Manejo de errores

Aprendí a utilizar `try/catch` y `axios.isAxiosError()` para identificar errores de Axios y consultar información como el código HTTP y el mensaje enviado por el backend.

También comprendí la importancia de propagar los errores mediante `throw error` cuando el componente que utiliza el servicio necesita reaccionar ante una petición fallida.

Esto permite separar la comunicación con la API de la presentación de mensajes al usuario.

---

## 7. Navegación con React Router

Configuré las rutas de la aplicación utilizando React Router.

La estructura contempla:

- Una página principal para mostrar los contactos.
- Una página para crear contactos.
- Una página para editar un contacto específico.
- Un layout compartido para mantener elementos comunes, como la barra de navegación.

### Conceptos aprendidos

**`BrowserRouter`:** habilita la navegación basada en la URL.

**Rutas anidadas:** permiten organizar las páginas dentro de un layout compartido.

**`Outlet`:** muestra el componente correspondiente a la ruta hija.

**`useNavigate()`:** permite navegar mediante código, por ejemplo, después de guardar un contacto.

**`useParams()`:** permite obtener parámetros de la URL, como el ID del contacto que se desea editar.

**`NavLink`:** permite crear enlaces de navegación que conocen si su ruta está activa.

### Flujo de edición

Al seleccionar la opción de editar:

1. La aplicación navega a una ruta que contiene el ID del contacto.
2. `useParams()` obtiene el ID de la URL.
3. El servicio solicita ese contacto al backend.
4. El formulario recibe los datos del contacto.
5. El usuario puede modificar y guardar la información.

---

## 8. Componentes reutilizables

Durante el proyecto creé componentes para evitar repetir elementos de la interfaz.

### `Navbar`

Contiene la navegación principal de la aplicación.

### `CotactCard`

Muestra la información de un contacto y permite acceder a las acciones de editar y eliminar.

### `ButtonComponent`

Reutiliza un mismo componente de botón para diferentes acciones, como editar y eliminar.

### `FormularioContacto`

Es el componente principal para registrar y modificar contactos.

Recibe una propiedad opcional llamada `contactoInicial`:

- Si no recibe un contacto, los campos comienzan vacíos y el formulario permite crear uno nuevo.
- Si recibe un contacto, los campos se inicializan con sus datos y el formulario permite editarlo.

Esta decisión evita mantener dos formularios prácticamente iguales.

### `SuccessComponent` y `ErrorComponent`

Muestran mensajes de éxito y error para informar al usuario sobre el resultado de sus operaciones.

---

## 9. Hooks de React utilizados

### `useState`

Lo utilicé para administrar estados como:

- La lista de contactos.
- Los valores de los campos del formulario.
- El estado de carga.
- Los mensajes de éxito y error.
- El estado de envío del formulario.

Aprendí que actualizar el estado permite que React vuelva a renderizar los componentes con la información actualizada.

### `useEffect`

Lo utilicé para cargar los contactos al entrar en la página principal y para gestionar determinados efectos relacionados con los mensajes y la navegación.

También aprendí que no es necesario utilizar un efecto para toda operación y que los efectos deben tener una finalidad clara.

### `useNavigate` y `useParams`

Aunque pertenecen a React Router, los utilicé junto con los hooks de React para navegar entre páginas y recuperar el identificador de un contacto.

---

## 10. Formularios controlados

Los campos del formulario utilizan estados de React para mantener sus valores.

Por ejemplo:

```tsx
const [nombre, setNombre] = useState<string>("");

<input
  type="text"
  value={nombre}
  onChange={(event) => setNombre(event.target.value)}
/>
```

### ¿Qué aprendí?

- `value` establece el valor que muestra el campo.
- `onChange` actualiza el estado cuando el usuario escribe.
- `required` permite indicar que un campo es obligatorio.
- `type="email"` proporciona una validación básica del formato del correo.

También comprendí que las validaciones del frontend mejoran la experiencia de usuario, pero no sustituyen las validaciones del backend.

---

## 11. Integración con el backend

El frontend consume la API REST del proyecto, que utiliza Express, TypeScript y MongoDB mediante Mongoose.

El flujo general de una operación es:

1. El usuario realiza una acción desde la interfaz.
2. El componente llama al servicio correspondiente.
3. El servicio realiza una petición HTTP mediante Axios.
4. El backend procesa la solicitud y consulta o modifica la base de datos.
5. El frontend recibe la respuesta y actualiza su interfaz.

### Actualización de la interfaz

Después de eliminar un contacto, utilicé `filter()` para actualizar el estado local sin necesidad de volver a cargar toda la página.

Esta práctica me permitió comprender cómo actualizar una colección de datos de forma inmutable en React.

---

## 12. Manejo de carga y errores

En la página principal implementé estados para distinguir entre:

- La carga inicial de los contactos.
- La lista de contactos disponible.
- Un error al obtener la información.
- Una lista sin contactos registrados.

También utilicé un indicador de envío para deshabilitar el botón del formulario mientras se procesa una operación.

### Manejo de errores HTTP

Aprendí a distinguir errores mediante su código de estado.

Por ejemplo, el código `409 Conflict` permite informar que un teléfono o correo ya se encuentra registrado, según la validación del backend.

Los mensajes se presentan mediante componentes reutilizables en lugar de depender únicamente de la consola del navegador.

---

## 13. Diseño con Tailwind CSS

Utilicé Tailwind CSS para diseñar las tarjetas, los formularios, los botones y los mensajes.

Entre las clases practicadas se encuentran:

- `flex` y `gap-*`: distribución de elementos.
- `p-*` y `m-*`: espaciado.
- `rounded-*`: bordes redondeados.
- `shadow-*`: sombras.
- `bg-*` y `text-*`: colores.
- `hover:*` y `focus:*`: estados interactivos.
- `disabled:*`: estilos para controles deshabilitados.

El objetivo fue construir una interfaz sencilla y clara, manteniendo los estilos cerca del componente que los utiliza.

---

## 14. Funcionalidades implementadas

- [x] Mostrar la lista de contactos.
- [x] Consultar un contacto por su identificador.
- [x] Crear contactos.
- [x] Editar contactos existentes.
- [x] Eliminar contactos.
- [x] Mostrar estados de carga.
- [x] Mostrar mensajes de éxito y error.
- [x] Validar errores devueltos por el backend.
- [x] Evitar el envío repetido del formulario mientras se guarda.
- [x] Reutilizar el mismo formulario para crear y editar.
- [x] Mantener actualizada la lista después de eliminar un contacto.

---

## 15. Lo que aprendí durante el proyecto

Este proyecto me permitió reforzar los fundamentos de React y comprender mejor cómo se estructura una aplicación frontend conectada a una API.

Los aprendizajes más importantes fueron:

1. Separar páginas, componentes, servicios y tipos.
2. Utilizar interfaces para representar datos y propiedades.
3. Administrar estados con `useState`.
4. Cargar información mediante peticiones asíncronas.
5. Comprender el propósito de `useEffect`.
6. Organizar la navegación con React Router.
7. Utilizar parámetros de URL para consultar y editar recursos.
8. Centralizar las peticiones HTTP con Axios.
9. Manejar errores sin ocultarlos a los componentes.
10. Reutilizar componentes para evitar duplicar código.
11. Actualizar el estado de React sin modificar directamente los datos existentes.
12. Comprender cómo se comunican el frontend, el backend y la base de datos.

También reforcé la idea de que el frontend y el backend tienen responsabilidades diferentes: el frontend se encarga de la interacción y presentación, mientras que el backend debe proteger la integridad de los datos y aplicar las validaciones necesarias.

---

## 16. Posibles mejoras futuras

Estas mejoras quedan pendientes para una siguiente etapa, sin ampliar el alcance del mini proyecto actual:

- Incorporar búsqueda de contactos.
- Agregar paginación si la cantidad de registros lo requiere.
- Mejorar el diseño adaptable a dispositivos móviles.
- Crear componentes reutilizables adicionales, como campos de entrada, indicadores de carga y notificaciones.
- Mejorar la configuración de la URL de la API mediante variables de entorno.
- Añadir pruebas automatizadas.
- Incorporar validaciones de formularios con React Hook Form y Zod en una etapa posterior.

---

## 17. Conclusión

El Gestor de contactos fue un proyecto práctico para consolidar mis conocimientos de React y TypeScript, practicar la navegación entre páginas y conectar una interfaz con un backend propio.

Más que agregar muchas funcionalidades, el propósito fue comprender cómo se relacionan los componentes, los estados, los servicios y las peticiones HTTP dentro de una aplicación real.

Este proyecto queda como referencia para futuros desarrollos y como base para continuar aprendiendo herramientas y patrones más avanzados del ecosistema de React.
