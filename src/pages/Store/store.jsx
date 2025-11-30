import {useState} from 'react'
import PokemonShop from '../PokemonShop/pokemonShop.jsx'
import ItemsShop from '../ItemsShop/itemsShop.jsx'
import './store.css'



export default function Store({}){
	const [actualSection, setActualSection] = useState("campeones")
	const buttonPokemon = actualSection == "campeones" ? {borderBottom:"2px solid #CDBE91 ", color:"#F0E6D2"} : null
    const buttonPokedex = actualSection == "aspectos" ? {borderBottom:"2px solid #CDBE91 ", color:"#F0E6D2"} : null


	return (
		<section className="store">
			<header className="store-header">
				<div className="sections-items">
					<div style={buttonPokemon} className="subheader-item" onClick={()=>setActualSection("campeones")}>CAMPEONES</div>
					<div style={buttonPokedex} className="subheader-item" onClick={()=>setActualSection("aspectos")}>ASPECTOS</div>
				</div>
				<div className="right-items">
					<div className="buy-rp-button">COMPRAR RP</div>
				</div>
			</header>

			{actualSection == "campeones" && <PokemonShop/>}
			{actualSection == "aspectos" && <ItemsShop/>}
		</section>
	)
}



