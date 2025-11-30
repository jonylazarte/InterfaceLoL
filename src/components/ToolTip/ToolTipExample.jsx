import React from 'react';
import Tooltip from './ToolTip';

const TooltipExample = () => {
  // Datos de ejemplo para el ToolTip
  const tooltipContent = {
    masteryLevel: 1,
    championName: "BRIAR",
    masteryPoints: 0,
    maxSeasonRating: "N/D",
    startInfo: "A",
    eternals: ["Serie 1", "Serie 2", "Serie Inicial"]
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#1a1c21', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '50px' }}>
        Ejemplo del ToolTip
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {/* Ejemplo con posición derecha */}
        <Tooltip content={tooltipContent} position="right">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#c89b3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Hover sobre mí (Derecha)
          </button>
        </Tooltip>

        {/* Ejemplo con posición izquierda */}
        <Tooltip content={tooltipContent} position="left">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#0ac8b9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Hover sobre mí (Izquierda)
          </button>
        </Tooltip>

        {/* Ejemplo con posición arriba */}
        <Tooltip content={tooltipContent} position="top">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#a09b8c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Hover sobre mí (Arriba)
          </button>
        </Tooltip>
      </div>

      <div style={{ 
        marginTop: '50px', 
        padding: '20px', 
        backgroundColor: '#2a2c31', 
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3>Instrucciones:</h3>
        <ul>
          <li>Pasa el mouse sobre los botones para ver el ToolTip</li>
          <li>El ToolTip se posiciona automáticamente según la posición especificada</li>
          <li>Los datos se pueden personalizar pasando diferentes objetos al prop 'content'</li>
        </ul>
        
        <h3>Estructura del objeto content:</h3>
        <pre style={{ backgroundColor: '#1a1c21', padding: '15px', borderRadius: '4px' }}>
{`{
  masteryLevel: 1,           // Nivel de maestría
  championName: "BRIAR",     // Nombre del campeón
  masteryPoints: 0,          // Puntos de maestría actuales
  maxSeasonRating: "N/D",    // Calificación máxima de temporada
  startInfo: "A",            // Información del botón de inicio
  eternals: [                // Lista de eternos disponibles
    "Serie 1",
    "Serie 2", 
    "Serie Inicial"
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default TooltipExample;
