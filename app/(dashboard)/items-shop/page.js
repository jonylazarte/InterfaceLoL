'use client';

import '@/pages/ItemsShop/itemsShop.css';
import { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmPurchaseWindow from '@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx';
import { buyItem } from '@/redux/slices/userItemsSlice.js';
import { selectUserItemsData } from '@/redux/slices/userItemsSlice.js';

export default memo(function ItemsShop() {
  const [items, setItems] = useState([]);
  const [renderData, setRenderData] = useState([]);
  
  const dispatch = useDispatch();
  const { loading, userItems, error } = useSelector(selectUserItemsData);

  // Cargar todos los items de la PokeAPI
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/item?offset=0&limit=304`)
      .then((response) => response.json())
      .then((data) => {
        setItems(data.results);
        setRenderData(data.results);
      })
      .catch((err) => console.error('Error cargando items:', err));
  }, []);

  // Ventana de confirmación de compra
  const { PurchaseWindow, activeWindow } = ConfirmPurchaseWindow("item");

  const handleBuyItem = (item) => {
    // Aquí puedes abrir la ventana de confirmación o disparar directamente la acción
    dispatch(buyItem(item));
  };

  return (
    <div className="items-shop">
      <h2>Items Shop</h2>

      {loading && <p>Cargando items...</p>}
      {error && <p className="error">Error: {error}</p>}

      <div className="items-grid">
        {renderData.map((item) => {
          const itemName = item.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const itemId = item.url.split('/').slice(-2, -1)[0];

          return (
            <div key={item.name} className="item-card">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`}
                alt={itemName}
                onError={(e) => {
                  e.currentTarget.src = '/fallback-item.png'; // opcional: imagen por defecto
                }}
              />
              <h3>{itemName}</h3>
              <button onClick={() => handleBuyItem(item)}>
                Comprar
              </button>
            </div>
          );
        })}
      </div>

      <PurchaseWindow />
      {activeWindow && <div className="modal-backdrop" />}
    </div>
  );
});