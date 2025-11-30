'use client';

import '@/pages/Pokedex/styles.css';
import { useState, useEffect, useRef, memo } from 'react';
import Card from '@/components/cards/pokeCard.jsx';
import { useSelector } from 'react-redux';
import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';
import { useRouter } from 'next/navigation';
import { BsSearch } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import UseNearScreen from '@/services/UseNearScreen.js';

const LIMIT = 24; // cuántos Pokémon cargar por página

export default memo(function Pokedex() {
  const [pokemon, setPokemon] = useState([]);          // Todos los Pokémon cargados
  const [renderData, setRenderData] = useState([]);    // Los que se muestran actualmente (filtrados)
  const [searchKeys, setSearchKeys] = useState('');
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { loading, userPokemon, error } = useSelector(selectUserPokemonData);

  const router = useRouter();
  const externalRef = useRef<HTMLDivElement>(null);
  const { isNearScreen } = UseNearScreen({
    externalRef: loading || isLoadingMore ? null : externalRef,
    once: false,
  });

  // Carga inicial + infinite scroll
  useEffect(() => {
    const loadPokemon = async () => {
      setIsLoadingMore(true);
      const offset = page * LIMIT;

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`
        );
        const data = await res.json();

        const detailedPokemon = await Promise.all(
          data.results.map(async (p: { url: string }) => {
            const pokeRes = await fetch(p.url);
            return pokeRes.json();
          })
        );

        setPokemon((prev) => [...prev, ...detailedPokemon]);
        setRenderData((prev) => [...prev, ...detailedPokemon]);
      } catch (err) {
        console.error('Error cargando Pokémon:', err);
      } finally {
        setIsLoadingMore(false);
      }
    };

    loadPokemon();
  }, [page]);

  // Infinite scroll: cuando el sentinel entra en pantalla → siguiente página
  useEffect(() => {
    if (isNearScreen && !loading && !isLoadingMore) {
      setPage((prev) => prev + 1);
    }
  }, [isNearScreen, loading, isLoadingMore]);

  // Filtro por nombre o ID
  useEffect(() => {
    if (!searchKeys) {
      setRenderData(pokemon);
      return;
    }

    const filtered = pokemon.filter((p: any) =>
      p.name.toLowerCase().includes(searchKeys.toLowerCase()) ||
      p.id.toString().includes(searchKeys)
    );
    setRenderData(filtered);
  }, [searchKeys, pokemon]);

  // Indica si un Pokémon está en la colección del usuario
  const isInCollection = (pokemonId: number) => {
    return userPokemon.some((p: any) => p.pokemonId === pokemonId);
  };

  return (
    <div className="pokedex">
      <h2>Pokédex</h2>

      {/* Buscador */}
      <div className="search-bar">
        <BsSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre o #ID..."
          value={searchKeys}
          onChange={(e) => setSearchKeys(e.target.value)}
        />
      </div>

      {/* Grid de cartas */}
      <div className="pokemon-grid">
        {renderData.map((poke: any) => (
          <div key={poke.id} className="pokemon-card-wrapper">
            {isInCollection(poke.id) && <FaCheck className="check-icon" />}
            <Card pokemon={poke} />
          </div>
        ))}
      </div>

      {/* Sentinel para infinite scroll */}
      <div ref={externalRef} style={{ height: '20px' }} />

      {/* Estados de carga y error */}
      {(loading || isLoadingMore) && <p className="loading">Cargando más Pokémon...</p>}
      {error && <p className="error">Error: {error}</p>}
      {renderData.length === 0 && !loading && <p>No se encontraron Pokémon.</p>}
    </div>
  );
});