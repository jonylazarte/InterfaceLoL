"use client";

import {memo} from 'react'
import './explore.css'
import { MdArrowBackIos } from "react-icons/md";
import PlayButton from '@/components/playButton/playButton.jsx'
import { useDispatch } from 'react-redux'
import { setUserState } from '@/redux/slices/userInterfaceSlice.js'


export default memo(function Explore(){
	const dispatch = useDispatch()

	return <section className="explore-room">
	<div className='room-header'><MdArrowBackIos onClick={()=>{dispatch(setUserState('Online'))}} className="header-arrow" /><img src='https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/mini-sr.png'/><h3>GL · EXPLORACION DE ZONA · OCULTO</h3></div>
	<PlayButton type={"explore-room"} text={"INICIAR"} />
	</section>
})