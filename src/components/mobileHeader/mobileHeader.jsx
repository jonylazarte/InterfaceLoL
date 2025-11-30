import './mobileHeader.css'
import HeaderMainButton from '@/components/playButton/HeaderMainButton/HeaderMainButton.jsx'
import { RiSidebarFoldFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { selectUserInterfaceData, setActualSection} from '@/redux/slices/userInterfaceSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { GiStoneCrafting } from "react-icons/gi";



export default function MobileHeader({showSideNav, setShowSideNav}){
	const {actualSection, userState} = useSelector(selectUserInterfaceData);
	const dispatch = useDispatch()
	const selectedStyle = {/*background: "linear-gradient(rgb(9, 17, 30) 50%, rgb(47, 50, 52))",*/ color: "#F0E6D2"}
	const [isNavigationOpen, setIsNavigationOpen] = useState(false)

	const handleSound = (sound) => {
			const buttonPlayClick = new Audio('/general/button-play-click.mp3');
			const buttonPlayHover = new Audio('/general/button-play-hover.mp3');
			const menuClick = new Audio('/general/menu-click.mp3')

			sound == "menu-click" && menuClick.play();
			sound == "button-play-click" && buttonPlayClick.play();
			sound == "button-play-hover" && buttonPlayHover.play()
		}
	const handleClick = (section) => {
			handleSound('menu-click');
			dispatch(setActualSection(section));
		}
	const Tab = ({section}) => {
			return (
					<div className="item" content={section} style={actualSection === section ? selectedStyle : null} onClick={() => handleClick(section)}>
						<svg width="22" height="22" fill="currentColor">
						  <use href={`/icon.svg#${section}`} />
						  {section === 'Botín' && <GiStoneCrafting fontSize="1.4rem" />}
						</svg>
					</div>
			)
		}

	return <header className="mobile-header">
		<HeaderMainButton/>
		<div className="mobile-header-tabs">
			<div className="item" onClick={()=>setIsNavigationOpen(prev=>!prev)}><TiThMenu fontSize="1.3rem" /></div>
			<div className="item" onClick={()=>setShowSideNav(prev=>!prev)}><RiSidebarFoldFill fontSize="1.3rem"/></div>
		</div>
		{ isNavigationOpen && <div className="mobile-navigation-window">
			<Tab onClick={() => setIsNavigationOpen(false)} section="Colección"/>
		    {/*<Tab onClick={() => setIsNavigationOpen(false)} section="Botín" />*/}
		    <Tab onClick={() => setIsNavigationOpen(false)} section="Tienda" />
		</div>}
	</header>
}