# LOL Interface Clone - Next.js

Este proyecto es un clon de la interfaz de League of Legends construido con Next.js.

## Características

- ⚡ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos
- 🔄 Redux Toolkit para manejo de estado
- 🎭 Framer Motion para animaciones
- 📱 Diseño responsive
- 🔐 Sistema de autenticación

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Ejecuta la aplicación construida
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
├── app/                 # Next.js App Router
│   ├── layout.js       # Layout principal
│   ├── page.js         # Página principal
│   └── globals.css     # Estilos globales
├── src/                 # Código fuente
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── redux/          # Store y slices de Redux
│   ├── services/       # Servicios y APIs
│   └── styles/         # Estilos adicionales
├── public/              # Archivos estáticos
└── fonts/               # Fuentes personalizadas
```

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **React 18** - Biblioteca de UI
- **Redux Toolkit** - Manejo de estado
- **Tailwind CSS** - Framework de CSS
- **Framer Motion** - Animaciones
- **Formik + Yup** - Formularios y validación

## Migración desde Vite

Este proyecto fue migrado desde Vite a Next.js. Los principales cambios incluyen:

- Reemplazo de Vite por Next.js
- Migración del routing de Wouter al App Router de Next.js
- Adaptación de la estructura de archivos
- Preservación de toda la funcionalidad existente
