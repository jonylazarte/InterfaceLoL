import './header.css'
import '../playButton/playButton.css'
import HeaderMainButton from '@/components/playButton/HeaderMainButton/HeaderMainButton.jsx'
import react, {useState, useEffect, memo} from 'react'
import { GiDoubled, GiDividedSquare } from "react-icons/gi";
import { useSelector, useDispatch } from 'react-redux'
import { RiSidebarFoldFill } from "react-icons/ri";
import { GiStoneCrafting } from "react-icons/gi";
import { selectUserInterfaceData, setActualSection} from '@/redux/slices/userInterfaceSlice.js'
import MiniTooltip from '@/components/ToolTip/miniTooltip/miniTooltip.jsx'


	export const ToolTip = () => {
		const [windowPosition, setWindowPosition] = useState({ x:0, y:0, width:0 })
		const [showWindow, setShowWindow] = useState(false)
		const [textInElement, setTextInElement] = useState("")
		const [timeoutId, setTimeoutId] = useState(null);
		
		const ToolTipElement = () => {
			return showWindow ? <div style={{position:"fixed", left: windowPosition.x - windowPosition.width * 1.5 , top: windowPosition.y, width: windowPosition.width * 4, display: "flex", justifyContent: "center", overflow: "visible"}}><div className="header-tooltip" >{textInElement}</div></div> : null
		}
		const handleToolTip = (e, text) => {
			if (timeoutId){
     			clearTimeout(timeoutId);
    		}
    		const nuevoTimeOutId = setTimeout(()=>{
    			const elemento = e.target;
				const rect = elemento.getBoundingClientRect();

				setWindowPosition({ x: rect.left, y: rect.top + rect.height + 20, width: rect.width })
				setTextInElement(text)
				setShowWindow(true)
			},550)
			setTimeoutId(nuevoTimeOutId)		
		}
		const offToolTip = () => {
			setShowWindow(false)
			if (timeoutId) {
		      clearTimeout(timeoutId); // Cancelar el timeout si el mouse sale
		      setTimeoutId(null); // Limpiar el ID del timeout
		    }
		}

		return ({ToolTipElement, handleToolTip, offToolTip})
	}

	export default memo(function Header({globalRoom, showSideNav, setShowSideNav, logout}){
		const user = useSelector(state => state.user)
		const {ToolTipElement, handleToolTip, offToolTip} = ToolTip()
		const selectedStyle = {background: "linear-gradient(rgb(9, 17, 30) 50%, rgb(47, 50, 52))", color: "#F0E6D2"}
		const dispatch = useDispatch();
		const {actualSection, userState} = useSelector(selectUserInterfaceData);

		const handleSound = (sound) => {
			const buttonPlayClick = new Audio('/general/button-play-click.mp3');
			const buttonPlayHover = new Audio('/general/button-play-hover.mp3');
			const menuClick = new Audio('/general/menu-click.mp3')

			sound == "menu-click" && menuClick.play();
			sound == "button-play-click" && buttonPlayClick.play();
			sound == "button-play-hover" && buttonPlayHover.play()
		}

		/*const HeaderIconButton = () => {
			const [isGlowing, setIsGlowing] = useState(false);

		  	const handleClick = () => {
		    	// Activa la clase
		    	setIsGlowing(true);
		    	handleSound('menu-click');
		    	dispatch(setActualSection("Home"));
		   	 	// La quita después de la duración de la animación (ej. 600ms)
		    	setTimeout(() => {
		      		setIsGlowing(false);
		    	}, 1000);
		  	};
			return <>
				<div onMouseLeave={()=>offToolTip()} onMouseEnter={(e)=>handleToolTip(e, "Inicio")} style={actualSection == "Inicio" ? selectedStyle : null} onClick={() => handleClick() } className={`item ${isGlowing ? 'glow' : ''}`}>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m21.1 6.551l.03.024c.537.413.87 1.053.87 1.757v11.256A3.4 3.4 0 0 1 18.6 23H5.4A3.4 3.4 0 0 1 2 19.588V8.332c0-.704.333-1.344.87-1.757l.029-.023l7.79-5.132a2.195 2.195 0 0 1 2.581 0zM10 13v8H8v-8.2c0-.992.808-1.8 1.8-1.8h4.4c.992 0 1.8.808 1.8 1.8V21h-2v-8z" clip-rule="evenodd"/></svg>
				</div>
			</>
		}*/
		const handleClick = (section) => {
			handleSound('menu-click');
			dispatch(setActualSection(section));
		}
		const tabIcon = {
			'LoL': "",
			'Colección': "",
			'Botín': "",
			'Tienda': ""
		}
		const Tab = ({section}) => {
			return (
				<MiniTooltip delay={100} position="bottom" content={section}>
					<div className="item" content={section} style={actualSection === section ? selectedStyle : null} onClick={() => handleClick(section)}>
						<svg width="22" height="22" fill="currentColor">
						  <use href={`/icon.svg#${section}`} />
						  {section === 'Botín' && <GiStoneCrafting fontSize="1.4rem" />}
						</svg>
					</div>
				</MiniTooltip>
			)
		}
		return <>
			<header style={{marginRight: `${!showSideNav ? '0px' : null}`, marginTop: `${(userState === 'In explore match' || userState === 'In normal match') ? '-110px' : '0px'}`} } className="index-header">

				<HeaderMainButton text={"JUEGA"} />
				<div onClick={() => handleClick("Home")} className="item-lol">LOL</div>

	    		<div className="header-sections">
	    			{/*<Tab section="Inicio" />
	    				<div className="icon-separator"></div>*/}
		      		<Tab section="Colección"/>
		      		<Tab section="Botín" />
		      			<div className="icon-separator"></div>
		      		<Tab section="Tienda" />
		      			<div className="icon-separator"></div>
		      		<div className="account-coins">
		      			<div  className="riot-points"><img src="/general/RP_icon.png"></img><div className="RP">{user.RP}</div><div className="header-buy-rp-button"><div className="buy-rp-icon">+</div></div></div>
		      			<div  className="blue-essences"><img src="/general/BE_icon.png"></img><div className="BE">{user.BE / 1000} K</div></div>
	      			</div>
	      			{/*<div onClick={()=>setShowSideNav(true)} className="item" style={{ display: "flex", alignItems: "center", justifyContent: "center" , display: showSideNav ? `none` : 'flex'}}><RiSidebarFoldFill /></div>*/}
	    		</div>
	    	</header>
		</>
		
})
