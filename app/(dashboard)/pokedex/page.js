'use client'

import '../../../src/pages/Pokedex/styles.css'
import {react, useState, useEffect, memo, useRef} from 'react'
import Card from '../../../src/components/cards/pokeCard.jsx'
import {useSelector, useDispatch} from 'react-redux'
import { selectUserPokemonData } from '../../../src/redux/slices/userPokemonSlice.js';
import {useRouter} from 'next/navigation'
import { BsSearch } from "react-icons/bs"
import { FaCheck } from "react-icons/fa6";
import UseNearScreen from '../../../src/services/UseNearScreen.js'

export default memo(function Pokedex(){
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [pokemon, setPokemon] = useState([]);
	const [renderData, setRenderData] = useState([]) 
	const [searchKeys, setSearchKeys] = useState()
	const {loading, userPokemon, error} = useSelector(selectUserPokemonData)
    const [types, setTypes] = useState()
    const [typeSelected, setTypeSelected] = useState()
    const [generations, setGenerations] = useState()
    const [generationSelected, setGenerationSelected] = useState()
    const [inCollection, setInCollection] = useState(false)
    const [sortedBy, setSortedBy] = useState("")
    const [pokemonFrom, setPokemonFrom] = useState("All")
    const router = useRouter();
    const token = localStorage.getItem('token')
    const externalRef = useRef()
    const {isNearScreen} = UseNearScreen({externalRef: loading ? null : externalRef, once: false})
    const [page, setPage] = useState(0)
    
    // ... resto del código del componente
    return (
        <div className="pokedex">
            <h2>Pokédex</h2>
            {/* Implementar interfaz del pokédex */}
        </div>
    )
})
