'use client'

import '../../../src/pages/ItemsShop/itemsShop.css'
import {useState, useEffect, memo} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { BsSearch } from "react-icons/bs"
import { GiDoubled, GiDividedSquare } from "react-icons/gi";
import { FaCheck } from "react-icons/fa6";
import ConfirmPurchaseWindow from '@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx'
import { updateCoins } from '@/redux/slices/userSlice.js';

export default memo(function ItemsShop(){
	const API_URL = process.env.NEXT_PUBLIC_API_URL
	const [items, setItems] = useState([])
	const [renderData, setRenderData] = useState([])
	const token = localStorage.getItem('token')
	const [searchKeys, setSearchKeys] = useState()
	const dispatch = useDispatch()
    const [types, setTypes] = useState()
    const [typeSelected, setTypeSelected] = useState()
    const [pokemonFrom, setPokemonFrom] = useState("All")
    const [inCollection, setInCollection] = useState(false)
    const [sortedBy, setSortedBy] = useState()
    const {PurchaseWindow, activeWindow} = ConfirmPurchaseWindow("item")

	useEffect(()=>{
		fetch(`https://pokeapi.co/api/v2/item?offset=0&limit=304`).then(response=>response.json()).then(data=>{ setItems(data.results); setRenderData(data.results) })
	},[])

	const handleBuyItem = (itemId)=>{
		// Implementar lógica de compra
		console.log('Comprando item:', itemId)
	}

	// ... resto del código del componente
	return (
		<div className="items-shop">
			<h2>Items Shop</h2>
			{/* Implementar interfaz de la tienda */}
		</div>
	)
})
