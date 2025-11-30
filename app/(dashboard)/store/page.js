'use client'

import '../../../src/pages/Store/store.css'
import {useState} from 'react'
import dynamic from 'next/dynamic'
import { IoIosGift } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";

const PokemonShop = dynamic(() => import('../../../src/pages/PokemonShop/pokemonShop.jsx'))
const ItemsShop = dynamic(() => import('../../../src/pages/ItemsShop/itemsShop.jsx'))

export default function Store({}){
	const [actualSection, setActualSection] = useState("campeones")

	return (
		<section className="store">
			<header className="store-header">
				<div className="sections-items">
					<div  className={`store-tab ${actualSection==='campeones' ? 'active-store-tab' : null}`} onClick={()=>setActualSection("campeones")}>CAMPEONES</div>
					<div  className={`store-tab ${actualSection==='aspectos' ? 'active-store-tab' : null}`}  onClick={()=>setActualSection("aspectos")}>ASPECTOS</div>
				</div>
				<div className="right-items">
					<div className="buy-rp-button">COMPRAR RP</div>
					<div className="rounded-button"><IoIosGift className="rounded-icon" /></div>
					<div className="rounded-button"><MdOutlineManageAccounts className="rounded-icon"/></div>
				</div>			
			</header>

			{actualSection == "campeones" && <PokemonShop/>}
			{actualSection == "aspectos" && <ItemsShop/>}
		</section>
	)
}
