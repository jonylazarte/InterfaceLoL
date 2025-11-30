'use client'

import '../../../src/pages/Bag/bag.css'
import {useState, memo} from 'react'
import dynamic from 'next/dynamic'

const Pokedex = dynamic(() => import('@/pages/Pokedex/index.jsx'))
const Skins = dynamic(() => import('@/pages/CollectionSkins/CollectionSkins.jsx'))

export default memo(function Bag(){
	const [actualSection, setActualSection] = useState("campeones")
    const sections = ['campeones', 'aspectos', 'gestos', 'runas', 'hechizos', 'objetos', 'íconos', 'centinelas', 'chromas', 'remates']

    const handleSound = (sound) => {
			const menuClick = new Audio('https://github.com/jonylazarte/resources/raw/refs/heads/main/general/menu-click.mp3')
			sound == "menu-click" && menuClick.play();
	}

	return <section className="bag">
	<header className="bag-header">
		{sections.map( section => 
			<div key={section} className={`collection-tab ${actualSection === section ? 'active-collection-tab' : null}`} onClick={()=>{handleSound('menu-click'); setActualSection(section)}}>{section.toUpperCase()}</div>
		)}
	</header>

		{actualSection == "aspectos" && <Skins></Skins>}
		{actualSection == "campeones" && <Pokedex></Pokedex>}

	</section>
})
