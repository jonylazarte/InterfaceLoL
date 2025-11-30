'use client';

import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';
import PokemonList from '@/components/pokemonList/pokemonList.jsx';
import './styles.css';

export default memo(function ExplorePokemonSelection() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Datos del usuario (pokemons que tiene)
  const { userPokemon = [] } = useSelector(selectUserPokemonData);

  // Estado de selección
  const [pokemonOne, setPokemonOne] = useState(null);
  const [pokemonTwo, setPokemonTwo] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('One'); // "One" | "Two"

  // Pokeballs visuales (para mostrar 3 slots por jugador)
  const pokeballsOne = Array(3).fill(null).map((_, i) => (i === 0 ? pokemonOne : null));
  const pokeballsTwo = Array(3).fill(null).map((_, i) => (i === 0 ? pokemonTwo : null));

  return (
    <div className="pokemon-selection">
      {/* Lista de pokemons disponibles para elegir */}
      <div className="pokemon-list-container">
        <PokemonList
          pokemonList={userPokemon}
          onSelect={(pokemon) => {
            if (currentPlayer === 'One') {
              setPokemonOne(pokemon);
            } else {
              setPokemonTwo(pokemon);
            }
            // Aquí podrías cambiar automáticamente al siguiente jugador si quieres
            // setCurrentPlayer(prev => prev === 'One' ? 'Two' : 'One');
          }}
          selectedPokemon={currentPlayer === 'One' ? pokemonOne : pokemonTwo}
        />
      </div>

      {/* Área de selección / ready */}
      <div className="ready-section">
        <div className="player-selection player-one">
          <h3>Jugador 1</h3>
          <div className="pokeball-slots">
            {pokeballsOne.map((p, i) => (
              <div key={i} className="pokeball-slot">
                {p ? (
                  <img src={p.image} alt={p.name} className="selected-pokemon" />
                ) : (
                  <div className="empty-slot" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="player-selection player-two">
          <h3>Jugador 2</h3>
          <div className="pokeball-slots">
            {pokeballsTwo.map((p, i) => (
              <div key={i} className="pokeball-slot">
                {p ? (
                  <img src={p.image} alt={p.name} className="selected-pokemon" />
                ) : (
                  <div className="empty-slot" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});