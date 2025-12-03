'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './skinTooltip.css';

const SkinTooltip = ({ content, children, position = 'right', delay = 500 }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const wrapperRef = useRef(null);
  const timeoutRef = useRef(null);
  console.log(actualPosition)
  const showTooltip = () => {
    // Limpiar cualquier timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configurar el timeout para mostrar el tooltip después del retraso
    timeoutRef.current = setTimeout(() => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const tooltipHeight = /*440*/ window.innerHeight / 100 * 20;
        const tooltipWidth = 330;
        
        // Encontrar el contenedor padre (el elemento que contiene el grid de campeones)
        let parentContainer = wrapperRef.current.closest('.grid-pokemon-container') || 
                             wrapperRef.current.closest('.Pokedex') || 
                             wrapperRef.current.closest('.pokedex-container');
        
        // Si no encontramos un contenedor específico, usar el body
        if (!parentContainer) {
          parentContainer = document.body;
        }
        
        const parentRect = parentContainer.getBoundingClientRect();
        
        let top = 0;
        let left = 0;
        let detectedPosition = position;

        // Detectar automáticamente la mejor posición basada en el contenedor padre
        if (position === 'right') {
          // Si está muy a la derecha del contenedor padre, cambiar a izquierda
          const rightEdge = rect.right - parentRect.left;
          if (rightEdge + tooltipWidth + 20 > parentRect.width) {
            detectedPosition = 'left';
          }
        } else if (position === 'left') {
          // Si está muy a la izquierda del contenedor padre, cambiar a derecha
          const leftEdge = rect.left - parentRect.left;
          if (leftEdge - tooltipWidth - 20 < 0) {
            detectedPosition = 'right';
          }
        }

        // Calcular posición basada en la posición detectada
        switch (detectedPosition) {
          case 'top':
            top = rect.top - tooltipHeight - 8;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            // Asegurar que no se salga del contenedor padre
            if (left < parentRect.left + 8) left = parentRect.left + 8;
            if (left + tooltipWidth > parentRect.right - 8) left = parentRect.right - tooltipWidth - 8;
            break;
            
          case 'bottom':
            top = rect.bottom + 8;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            // Asegurar que no se salga del contenedor padre
            if (left < parentRect.left + 8) left = parentRect.left + 8;
            if (left + tooltipWidth > parentRect.right - 8) left = parentRect.right - tooltipWidth - 8;
            break;
            
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - 20/*8*/;
            // Asegurar que no se salga del contenedor padre
            /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/
            if (top + tooltipHeight > parentRect.bottom - 8) top = parentRect.bottom - tooltipHeight - 8;
            break;
            
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + 20/*8*/;
            // Asegurar que no se salga del contenedor padre
            /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/
            if (top + tooltipHeight > parentRect.bottom - 8) top = parentRect.bottom - tooltipHeight - 8;
            break;
        }

        setActualPosition(detectedPosition);
        setCoords({ top, left });
        setVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    // Limpiar el timeout si el mouse sale antes de que aparezca
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      {visible &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            className="skin-tooltip"
            style={{
              top: coords.top,
              left: coords.left,
              position: 'fixed',
            }}
          >

          <div className="tooltip-header">
            {content.skinRarity !== 'NoRarity' ? <img className="tooltip-rarity-icon" src={`/raritys/${content.skinRarity}.png`}></img> : null}
            <h2 className="tooltip-skin-name">{content.skinName}</h2>
          </div>
          <div className="purchase-date-chroma-section">
            {
            content.inCollection ? `Adquirido en ${new Date(content.purchaseDate).toLocaleDateString('es-ES')}`
            : <><img className="w-5 h-5 mr-4 rp-icon" src="/general/RP_icon.png"></img> <span className="rp-price">{content.value}</span></>
            }
            {content.chromas ? <img className="chroma-icon" src={`/raritys/Chroma.png`}></img> : null}
          </div>
            
          </div>,
          document.body
        )}
    </>
  );
};

export default SkinTooltip;