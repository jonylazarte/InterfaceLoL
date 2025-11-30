# ToolTip Component

Componente ToolTip que replica el diseño de League of Legends.

## Uso

```jsx
import Tooltip from './components/ToolTip/ToolTip';

const tooltipContent = {
  masteryLevel: 1,
  championName: "BRIAR",
  masteryPoints: 0,
  maxSeasonRating: "N/D",
  startInfo: "A",
  eternals: ["Serie 1", "Serie 2", "Serie Inicial"]
};

<Tooltip content={tooltipContent} position="right">
  <button>Hover sobre mí</button>
</Tooltip>
```

## Props

- `content`: Objeto con datos del campeón
- `children`: Elemento que activa el ToolTip
- `position`: Posición del ToolTip (top, bottom, left, right)

## Estructura

1. **Sección del Campeón**: Icono de maestría, nombre, puntos
2. **Sección INICIO**: Botón de inicio y "Juégalo gratis"
3. **Sección ETERNOS**: Lista de eternos disponibles
