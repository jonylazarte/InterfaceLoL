'use client'

import { useState, useEffect, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { BsSearch } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import Image from 'next/image';

import CustomSelect from '@/components/CustomSelect/CustomSelect.jsx';
import useConfirmPurchaseWindow, {
  ConfirmPurchaseWindowComponent,
} from '@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx';

import { selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js';
import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';

import './itemsShop.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default memo(function ItemsShop() {
  const [items, setItems] = useState([]);
  const [searchKeys, setSearchKeys] = useState('');
  const [inCollection, setInCollection] = useState(false);
  const [championInCollection, setChampionInCollection] = useState(false);
  const [sortedBy, setSortedBy] = useState('');
  const [sectionSelected, setSectionSelected] = useState('ASPECTOS');

  const [checkboxFilter, setCheckboxFilter] = useState({
    Limited: false,
    Legendary: false,
    Ultimate: false,
  });

  const { userSkins = [] } = useSelector(selectUserSkinsData);
  const { userChampions = [] } = useSelector(selectUserPokemonData);

  const {
    showWindow,
    productInfo,
    productPrice,
    newBalance,
    buttonStyles,
    buyProduct,
    activateWindow,
    closeWindow,
  } = useConfirmPurchaseWindow('skins');

  // Cargar skins
  useEffect(() => {
    fetch(`${API_URL}pokemons/data/skins`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // Filtro + ordenamiento
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Búsqueda
    if (searchKeys) {
      const query = searchKeys.toLowerCase();
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(query)
      );
    }

   

  

    // Filtros de rareza / disponibilidad limitada
    const activeFilters = Object.keys(checkboxFilter).filter(
      (key) => checkboxFilter[key]
    );

    if (activeFilters.length > 0) {
      result = result.filter((item) => {
        if (activeFilters.includes('Limited')) {
          return item.availability === 'Limited';
        }
        return activeFilters.includes(item.rarity);
      });
    } else {
      // Si no está marcado "Limited", ocultar los de disponibilidad limitada
      result = result.filter((item) => item.availability !== 'Limited');
    }

    // Ordenamiento
    if (sortedBy) {
      result.sort((a, b) => {
        switch (sortedBy) {
          case 'PriceRpDescend':
            return Number(b.value) - Number(a.value);
          case 'PriceRpAscend':
            return Number(a.value) - Number(b.value);
          case 'alphabetically descend':
            return a.name.localeCompare(b.name);
          case 'alphabetically ascend':
            return b.name.localeCompare(a.name);
          case 'ReleaseAscend':
            return 0; // ya vienen ordenados por defecto (más nuevos primero)
          default:
            return 0;
        }
      });
    }

    return result.slice(0, 200);
  }, [
    items,
    searchKeys,
    inCollection,
    championInCollection,
    checkboxFilter,
    sortedBy,
    userSkins,
    userChampions,
  ]);

  const toggleCheckbox = (rarity) => {
    setCheckboxFilter((prev) => ({
      ...prev,
      [rarity]: !prev[rarity],
    }));
  };

  const sections = ['ASPECTOS', 'CHROMAS', 'PAQUETES'];
  const rarityLabels = {
    Limited: 'Disp. Limitada',
    Legendary: 'Legendario',
    Ultimate: 'Definitivo',
  };

  const sortOptions = [
    { value: '', label: 'Lanzamiento (reciente primero)' },
    { value: 'ReleaseAscend', label: 'Lanzamiento (antiguo primero)' },
    { value: 'PriceRpDescend', label: 'Precio (RP) descendente' },
    { value: 'PriceRpAscend', label: 'Precio (RP) ascendente' },
    { value: 'alphabetically descend', label: 'Alfabético A→Z' },
    { value: 'alphabetically ascend', label: 'Alfabético Z→A' },
  ];

  return (
    <div className="items-section">
      <ConfirmPurchaseWindowComponent
        showWindow={showWindow}
        productInfo={productInfo}
        productPrice={productPrice}
        newBalance={newBalance}
        buttonStyles={buttonStyles}
        buyProduct={buyProduct}
        closeWindow={closeWindow}
        section="skins"
      />

      {/* Filtros Desktop */}
      {typeof window !== 'undefined' && window.innerWidth > 767 && (
        <div className="filter-nav">
          <section className="nav-section first">
            {sections.map((section) => (
              <div
                key={section}
                onClick={() => setSectionSelected(section)}
                className="checkbox section"
              >
                <div className="custom-checkbox-romb">
                  {sectionSelected === section && <div className="check-element" />}
                </div>
                <div className={sectionSelected === section ? 'section-selected' : ''}>
                  {section}
                </div>
              </div>
            ))}
          </section>

          <section className="nav-section">
            <div className="search-filter">
              <BsSearch className="search-icon" />
              <input
                type="search"
                placeholder="Buscar"
                onChange={(e) => setSearchKeys(e.target.value)}
              />
            </div>

            <div
              onClick={() => setInCollection((prev) => !prev)}
              className="checkbox collection"
            >
              <div className="custom-checkbox">
                {inCollection && <FaCheck className="check-icon" />}
              </div>
              Mostrar en colección
            </div>
          </section>

          <section className="nav-section">
            <CustomSelect
              className="select-filter"
              options={sortOptions}
              value={sortedBy}
              onChange={setSortedBy}
              placeholder="Ordenar por..."
            />

            <div
              onClick={() => setChampionInCollection((prev) => !prev)}
              className="checkbox"
            >
              <div className="custom-checkbox">
                {championInCollection && <FaCheck className="check-icon" />}
              </div>
              Campeón en colección
            </div>
          </section>

          <section className="nav-section">
            {['Limited', 'Legendary', 'Ultimate'].map((rarity) => (
              <div
                key={rarity}
                onClick={() => toggleCheckbox(rarity)}
                className="checkbox"
              >
                <div className="custom-checkbox">
                  {checkboxFilter[rarity] && <FaCheck className="check-icon" />}
                </div>
                {rarityLabels[rarity]}
              </div>
            ))}
          </section>
        </div>
      )}

      {/* Filtros Móvil */}
      {typeof window !== 'undefined' && window.innerWidth <= 767 && (
        <div className="filter-nav">
          <section className="nav-section">
            <div className="search-filter">
              <BsSearch className="search-icon" />
              <input
                type="search"
                placeholder="Buscar"
                onChange={(e) => setSearchKeys(e.target.value)}
              />
            </div>

            <div
              onClick={() => setInCollection((prev) => !prev)}
              className="checkbox collection"
            >
              <div className="custom-checkbox">
                {inCollection && <FaCheck className="check-icon" />}
              </div>
              Mostrar en colección
            </div>
          </section>
        </div>
      )}

      {/* Grid de skins */}
      <div className="items-grid-container">
        <div className="items">
          {filteredItems.map((skin) => (
            <article
              key={skin.id}
              className="skin-card"
              onClick={() => activateWindow(skin)}
            >
              <Image
                src={`/tiles/${skin.img}`}
                alt={skin.name}
                fill
                sizes="23vw"
                className="skin-card-image"
                style={{ objectFit: 'cover' }}
              />
              <div className="product-info">
                <h4 className="card-name">{skin.name}</h4>
                <div className="price">
                  <div className="rp-price">
                    {skin.availability !== 'Limited' && (
                      <img src="/general/RP_icon.png" alt="RP" className="w-3.5 h-3.5" />
                    )}
                    <span className="price-number">{skin.value}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
});