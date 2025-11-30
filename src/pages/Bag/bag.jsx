import Pokedex from '@/pages/Pokedex/index.jsx'
import './bag.css'
import {useState, memo} from 'react'


export default memo(function Bag(){
	const [actualSection, setActualSection] = useState("Pokemon")
    const buttonPokedex = actualSection == "Pokedex" ? {borderBottom:"2px solid #CDBE91 ", color:"#F0E6D2"} : null

    const handleSound = (sound) => {
			const menuClick = new Audio('https://github.com/jonylazarte/resources/raw/refs/heads/main/general/menu-click.mp3')
			sound == "menu-click" && menuClick.play();
	}

	return <section className="bag">
	<header className="bag-header">
	<div style={buttonPokedex} className="subheader-item" onClick={()=>{handleSound('menu-click'); setActualSection("Pokedex")}}>POKEDEX</div></header>

		{actualSection == "Pokedex" && <Pokedex></Pokedex>}

	</section>
})
