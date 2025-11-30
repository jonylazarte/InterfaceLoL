'use client';

import { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';

import PokemonList from '@/components/pokemonList/pokemonList.jsx';
import PlayButton from '@/components/playButton/playButton.jsx';

import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';

import './styles.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default memo(function PokemonSelection({ socket, roomId }) {
  const [teamOne, setTeamOne] = useState(Array(6).fill(null));
  const [teamTwo, setTeamTwo] = useState(Array(6).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(
    localStorage.getItem('currentPlayer') || 'One'
  );

  const [isPlayerOneReady, setIsPlayerOneReady] = useState(false);
  const [isPlayerTwoReady, setIsPlayerTwoReady] = useState(false);
  const [bothReady, setBothReady] = useState(false);

  const { userPokemon = [] } = useSelector(selectUserPokemonData);

  // Cargar Pokémon del usuario + tipos (solo una vez)
  useEffect(() => {
    if (userPokemon.length > 0) return; // ya cargados por Redux

    fetch(`${API_URL}pokemons/users/pokemon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: localStorage.getItem('token') }),
    });
    // types no se usan por ahora → se pueden cargar si hacen falta
  }, []);

  // Función para seleccionar/quitar Pokémon
  const selectPokemon = (pokemonIndex, player) => {
    const pokemon = userPokemon.find((p) => p.index === pokemonIndex);
    if (!pokemon) return;

    const currentTeam = player === 'One' ? teamOne : teamTwo;
    const setTeam = player === 'One' ? setTeamOne : setTeamTwo;

    const alreadyInTeam = currentTeam.findIndex((p) => p?.index === pokemonIndex);
    const emptySlot = currentTeam.findIndex((p) => p === null);

    // Si ya está en el equipo → quitarlo
    if (alreadyInTeam !== -1) {
      setTeam((prev) => {
        const newTeam = [...prev];
        newTeam[alreadyInTeam] = null;
        return newTeam;
      });
    }
    // Si hay espacio → agregarlo
    else if (emptySlot !== -1) {
      setTeam((prev) => {
        const newTeam = [...prev];
        newTeam[emptySlot] = pokemon;
        return newTeam;
      });
    }
  };

  // Enviar selección al otro jugador
  const emitPokemonSelection = (index) => {
    socket?.emit('select-pokemon', {
      index,
      player: currentPlayer,
      roomId,
    });
  };

  // Recibir selección del otro jugador
  useEffect(() => {
    socket?.on('select-pokemon', ({ index, player }) => {
      selectPokemon(index, player === 'One' ? 'Two' : 'One');
    });

    return () => socket?.off('select-pokemon');
  }, [socket, userPokemon]);

  // Enviar "Listo"
  const handleReady = () => {
    const myTeam = currentPlayer === 'One' ? teamOne : teamTwo;

    if (myTeam.filter(Boolean).length < 6) {
      alert('¡Debes seleccionar 6 Pokémon!');
      return;
    }

    socket?.emit('player-ready', {
      player: currentPlayer,
      team: myTeam,
      roomId,
    });

    if (currentPlayer === 'One') setIsPlayerOneReady(true);
    else setIsPlayerTwoReady(true);
  };

  // Recibir "Listo" del oponente
  useEffect(() => {
    socket?.on('player-ready', ({ player, team }) => {
      if (player === 'One') {
        setTeamOne(team);
        setIsPlayerOneReady(true);
      } else {
        setTeamTwo(team);
        setIsPlayerTwoReady(true);
      }
    });

    return () => socket?.off('player-ready');
  }, [socket]);

  // Cuando ambos estén listos
  useEffect(() => {
    if (isPlayerOneReady && isPlayerTwoReady) {
      setBothReady(true);
    }
  }, [isPlayerOneReady, isPlayerTwoReady]);

  const renderTeam = (team) => {
    return team.map((pokemon, i) => (
      <div key={i} className="pokemon-slot">
        {pokemon ? (
          <img
            src={pokemon.sprites?.other?.showdown?.front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
          />
        ) : (
          <div className="empty-slot" />
        )}
      </div>
    ));
  };

  if (bothReady) {
    return (
      <div className="battle-ready">
        <h2>¡Ambos jugadores listos!</h2>
        <p>La batalla comenzará en breve...</p>
      </div>
    );
  }

  return (
    <div className="pvp-pokemon-selection">
      {/* Lista de Pokémon disponibles */}
      <div className="pokemon-list-container">
        <PokemonList
          pokemonToRender={userPokemon}
          team={currentPlayer === 'One' ? teamOne : teamTwo}
          onSelect={(index) => {
            selectPokemon(index, currentPlayer);
            emitPokemonSelection(index);
          }}
          page="Pvp"
          currentPlayer={currentPlayer}
        />
      </div>

      {/* Equipos de selección */}
      <section className="teams-section">
        <div className="player-team">
          <h3>Jugador 1 {isPlayerOneReady && '(Listo)'}</h3>
          <div className="team-grid">{renderTeam(teamOne)}</div>
        </div>

        <div className="player-team">
          <h3>Jugador 2 {isPlayerTwoReady && '(Listo)'}</h3>
          <div className="team-grid">{renderTeam(teamTwo)}</div>
        </div>
      </section>

      {/* Botón Listo */}
      <PlayButton
        type="arenaPokemonSelection"
        text={
          (currentPlayer === 'One' && isPlayerOneReady) ||
          (currentPlayer === 'Two' && isPlayerTwoReady)
            ? 'Esperando al oponente...'
            : 'LISTO'
        }
        disabled={
          (currentPlayer === 'One' && isPlayerOneReady) ||
          (currentPlayer === 'Two' && isPlayerTwoReady) ||
          teamOne.filter(Boolean).length + teamTwo.filter(Boolean).length < 6
        }
        okButtonAction={handleReady}
      />
    </div>
  );
});