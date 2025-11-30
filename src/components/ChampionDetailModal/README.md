# ChampionDetailModal Component

Este componente crea una ventana modal que se abre al hacer clic en un campeón en la página de pokedex, mostrando información detallada del campeón seleccionado.

## Características

- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Animaciones**: Efectos visuales suaves y transiciones
- **Pestañas**: Sistema de navegación entre diferentes secciones (Resumen, Habilidades, Maestría, Eternos, Aspectos)
- **Estadísticas Visuales**: Gráfico de radar para mostrar las estadísticas del campeón
- **Información Detallada**: Muestra daño, estilo, dificultad, lore y más

## Uso

```jsx
import ChampionDetailModal from './components/ChampionDetailModal/ChampionDetailModal.jsx';

// En tu componente
const [selectedChampion, setSelectedChampion] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleChampionClick = (champion) => {
    setSelectedChampion(champion);
    setIsModalOpen(true);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChampion(null);
};

// En el JSX
<ChampionDetailModal
    champion={selectedChampion}
    isOpen={isModalOpen}
    onClose={handleCloseModal}
/>
```

## Props

- `champion`: Objeto con la información del campeón seleccionado
- `isOpen`: Boolean que controla si el modal está abierto
- `onClose`: Función que se ejecuta al cerrar el modal

## Estructura del Modal

### Header
- Icono del campeón
- Nombre y título del campeón
- Pestañas de navegación
- Botón de cerrar

### Panel Izquierdo (Información)
- Tipo de daño
- Estilo (slider melee/ranged)
- Dificultad (barra de progreso)
- Estadísticas (gráfico de radar)
- Lore del campeón
- Botones de acción

### Panel Derecho (Ilustración)
- Imagen de splash art del campeón
- Efectos de energía animados

## Estilos

El componente utiliza CSS Modules para evitar conflictos de estilos. Los estilos incluyen:

- Gradientes y efectos visuales
- Animaciones CSS
- Diseño responsive
- Colores temáticos de League of Legends

## Integración

Para integrar este modal en la página de pokedex:

1. Importar el componente
2. Agregar estado para controlar el modal
3. Pasar la función `onClick` al componente Card
4. Renderizar el modal al final del componente

## Notas

- El modal se cierra al hacer clic fuera de él
- Las imágenes se cargan desde las rutas `/tiles/` y `/splash/`
- El componente es completamente responsive
- Incluye efectos de hover y transiciones suaves
- **El modal se ajusta automáticamente al layout del dashboard usando variables CSS globales**

## Variables CSS del Dashboard

El modal utiliza las siguientes variables CSS globales para posicionarse correctamente:

```css
:root {
  --dashboard-header-height: 11.4vh;    /* Altura del header */
  --dashboard-sidebar-width: 17.6vw;    /* Ancho del sidebar */
  --dashboard-content-height: 88.4vh;   /* Altura del contenido */
  --dashboard-content-width: calc(100vw - var(--dashboard-sidebar-width));
}
```

### Ventajas de usar variables CSS:

1. **Consistencia**: El modal siempre tendrá el mismo tamaño que la sección bag
2. **Mantenibilidad**: Cambiar el layout del dashboard solo requiere modificar las variables
3. **Flexibilidad**: Fácil de ajustar para diferentes tamaños de pantalla
4. **Reutilización**: Otras secciones pueden usar las mismas variables

### Cómo cambiar el layout:

Para modificar el tamaño del dashboard (y por ende del modal), solo necesitas cambiar las variables en `src/styles/index.css`:

```css
:root {
  --dashboard-header-height: 15vh;    /* Header más alto */
  --dashboard-sidebar-width: 20vw;    /* Sidebar más ancho */
}
```

El modal se ajustará automáticamente sin necesidad de modificar su código.
