import './styles.css'
import PokemonList from '../../components/pokemonList/pokemonList.jsx'
import react, {useState, useEffect, useRef, memo} from 'react'
import {io} from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux'
import { selectUserPokemonData } from '../../redux/slices/userPokemonSlice.js'



export default memo(function ExplorePokemonSelection({}){
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
	  const [renderData, setRenderData] = useState([])
  	const [renderPokeballsOne, setRenderPokeballsOne] = useState([null,null,null])
  	const [renderPokeballsTwo, setRenderPokeballsTwo] = useState([null,null,null])
	  const [pokemonOne, setPokemonOne] = useState()
  	const [pokemonTwo, setPokemonTwo] = useState()
  	const [currentPlayer, setCurrentPlayer] = useState("One")
  	const [types, setTypes] = useState([])
  	const token = localStorage.getItem('token')
    const {loading, userPokemon, error} = useSelector(selectUserPokemonData)
    //const userName = localStorage.getItem('userName')

    //const socket = s//io(`${API_URL}`,{ auth: {token}})
   





  
	
	return <>
  { <div className="pokemon-selection">
    <div className='pokemon-list-container'>
      
    </div>
    <div className="ready-section"><div className="pokemon-one">
    {/*renderSelectedPokemon("One")*/}
    </div></div>

  	</div> 
  }

  	</>
})