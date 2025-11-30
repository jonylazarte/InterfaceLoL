import './modeSelection.css'
import {useState, memo} from 'react'
import { useSelector } from 'react-redux'
import { setUserState } from '@/redux/slices/userInterfaceSlice.js'
import Explore from '../Explore/explore.jsx'
import Pvp from '../PvpRoom/index.jsx'
import ConfirmButton from '../../components/playButton/playButton.jsx'

export default memo(function ModeSelection({socket, connectedUsers, roomUsers, setRoomUsers}){
	const [modeSelected, setModeSelected] = useState("Pvp")
	const [mapSelected, setMapSelected] = useState("arena")
	const [modeInHover, setModeInHover] = useState()
	const [queueSelected, setQueueSelected] = useState("CLASIFICATORIA SOLO")
  	const {userState} = useSelector(state => state.userInterface)
  	

  	const handleSound = (sound) => {
      const confirmButtonClick = new Audio('/general/confirm-button-click.mp3');
      const confirmButtonHover = new Audio('general/confirm-button-Hover.mp3');
      const confirmButtonCancelClick = new Audio('general/confirm-button-cancel-click.mp3');
      const findMatchButtonClick = new Audio('/general/find-match-button-click.mp3');
      const findMatchButtonHover = new Audio('/general/find-match-button-Hover.mp3');
      const menuClick = new Audio('/general/menu-click.mp3')

      sound == "confirm-button-click" && confirmButtonClick.play();
      sound == "confirm-button-hover" && confirmButtonHover.play();
      sound == "confirm-button-cancel-click" && confirmButtonCancelClick.play();
      sound == "find-match-button-click" && findMatchButtonClick.play();
      sound == "find-match-button-Hover" && findMatchButtonHover.play();
      sound == "menu-click" && menuClick.play();
    }

  	const pvpModeProps = {
	  	name: "arena",
	  	hoverImg: "sr-hover.png", // Include the file extension
	  	disabledImg: "sr-desabled.png", // Include the file extension
	  	enabledImg: "sr-enabled.png",
	  	subTitle: "1v1",
	  	title: "ARENA",
	  	description: "Arrasa a tus oponentes, sumérgete en peleas de uno contra uno y destruye los pokékon del enemigo en el modo de juego mas importante de LoP",
	  	queue: "CLASIFICATORIA SOLO",
	};
	const exploreModeProps = {
	  	name: "explorar",
	  	hoverImg: "sr-hover.png", // Include the file extension
	  	disabledImg: "sr-desabled.png", // Include the file extension
	  	enabledImg: "sr-enabled.png",
	  	subTitle: "1v1",
	  	title: "EXPLORAR",
	  	description: "Sube de nivel a tus Pokémon, aprende nuevas habilidades y desbloquea su verdadero potencial a medida que avanzas en la liga.",
	  	queue: "INTERMEDIO",
	};

	const queueOptionStyle = {color: "var(--gold-one)"}
  	const GameMode = ({name, hoverImg, enabledImg, disabledImg, subTitle, title, description, queue}) => {
  		return <>
  			<div className="gamemode-icons">
			<div className="gamemode-icon"  /*onMouseEnter={()=>setModeInHover(name)}*/ onMouseLeave={()=>setModeInHover("")}>
				<img src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/${modeInHover == name ? hoverImg : mapSelected == name ? enabledImg : disabledImg}`} />
				<h3 className="mode-subtitle">{subTitle}</h3>
				<h1>{title}</h1>
			</div>
			</div>
			<div className="description-and-queques">
				<div>
					<div className="gamemode-description">
						<p>{description}</p>
					</div>
					<div style={queueSelected == queue ? queueOptionStyle : null} className="queue-option">
					<div className="custom-checkbox">{queueSelected == queue ? <div className="checkboxMark"></div> : null}</div><h3>{queue}</h3>
					</div>
				</div>
			</div>
  		</>
  	}
	return <>
	{(userState !== "Exploración" && userState !== "Pvp" ) && <section className="mode-selection">

		<header className="mode-selection-header">
			<div className={`subheader-item ${modeSelected === 'Pvp' ? 'active-subheader-item' : null}`} onClick={()=>{handleSound('menu-click'); setModeSelected("Pvp"); setMapSelected("arena"); setQueueSelected("CLASIFICATORIA SOLO")}}>PVP</div>
			<div className={`subheader-item ${modeSelected === 'Exploración' ? 'active-subheader-item' : null}`} onClick={()=>{handleSound('menu-click'); setModeSelected("Exploración"); setMapSelected("explorar"); setQueueSelected("INTERMEDIO")}}>EXPLORAR</div>
		</header>
		{modeSelected == "Pvp" && <GameMode {...pvpModeProps}></GameMode>}
		{modeSelected == "Exploración" && <GameMode {...exploreModeProps}></GameMode>}
		<ConfirmButton text="CONFIRMAR" type="modeSelection" modeSelected={modeSelected} />
		
	</section>}
	{userState === "Pvp" && <Pvp socket={socket} connectedUsers={connectedUsers}  roomUsers={roomUsers} setRoomUsers={setRoomUsers} ></Pvp>}
  	{userState === "Exploración" && <Explore   ></Explore>}
	</>
})