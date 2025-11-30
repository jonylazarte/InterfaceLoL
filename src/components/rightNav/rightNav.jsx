import './rightNav.css'
import {useState, memo, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import { BsFillPersonPlusFill, BsClipboardPlusFill, BsSearch, BsTextRight } from "react-icons/bs"
import { RiFilePaper2Fill } from "react-icons/ri";
import { IoChatboxSharp } from "react-icons/io5";
import { PiChatCenteredFill, PiXBold } from "react-icons/pi";
import { MdBugReport, MdMinimize, MdOutlineQuestionMark } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa6";
import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";
import { IoIosSettings } from "react-icons/io";
import { FaRegWindowMinimize } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { selectUserInterfaceData } from '@/redux/slices/userInterfaceSlice.js'
import { 
  openChat, 
  selectChat, 
  updateChatUser, 
  updateUserStatus,
  toggleChatVisibility 
} from '@/redux/slices/chatSlice'
import { logout } from '@/redux/slices/authSlice.js'

export const ToolTip = () => {
		const [windowPosition, setWindowPosition] = useState({ x:0, y:0, width:0, height:0 })
		const [showWindow, setShowWindow] = useState(false)
		const [dataToRender, setDataToRender] = useState("")
		const [timeoutId, setTimeoutId] = useState(null);
		const style = {
					position:"fixed",
					right: 300 + 10,
					top: windowPosition.y -200,
					height: "300px",
					//width: windowPosition.width,
					display: "flex", 
					justifyContent: "center",
					alignItems: "center",
					backgroundImage: `url('https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/centered/${dataToRender.background}.jpg')`
		}
		const ToolTipElement = () => {
			return showWindow ? (
			<div className="out-box" style={style}>
					<div className="right-nav-user-tooltip">
							<div className="tooltip-user-container">
									<div className="tooltip-user-level">
											<img src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/7201_Precision.png"/><h3>24</h3>
									</div>
									<div className="tooltip-user-info">
											<div className="tooltip-user-icon">
													<img className="tooltip-user-border" src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/EoG_Border_150_4k.png"/>
													<img className="tooltip-user-icon-img" src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${dataToRender.profileIcon}.png`}></img>
											</div>
											<div className="tooltip-user-info-text">
													<h4>{dataToRender?.userName}</h4>
													<h6 className="subname">#{dataToRender?.tag}</h6>
													<span>{dataToRender.title}</span>
													<div className="separator"/>
													<span className="rank-and-points">{dataToRender?.rank?.name} ({dataToRender?.rank?.points} pts)</span>
											</div>

									</div>
									<div className="tooltip-user-status">
											<div className="user-status"><div style={{width: "10px", height: "10px"}} className="status-icon"></div>En línea</div>
									</div>								
							</div>
					</div>
			</div>) : null
		}
		const handleToolTip = (e, data) => {
			if (timeoutId){
     			clearTimeout(timeoutId);
    		}
    		const nuevoTimeOutId = setTimeout(()=>{
    		const elemento = e.target;
				const rect = elemento.getBoundingClientRect();

				setWindowPosition({ x: rect.left, y: rect.top + rect.height + 20, width: rect.width, height: rect.height })
				setDataToRender(data)
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

export default memo(function RightNav({socket, battleRequest, handleEmitBattleRequest, showSideNav, setShowSideNav, setToken}){
		const dispatch = useDispatch()
		const [showMenu, setShowMenu] = useState()
		const [menuPosition, setMenuPosition] = useState({ x:0, y:0 })
		const {ToolTipElement, handleToolTip, offToolTip} = ToolTip()
		const user = useSelector(state => state.user);
		const router = useRouter()
		const { userState } = useSelector(selectUserInterfaceData)
		const { friendsOnline } = useSelector(state => {return state.connectedUsers})
		const { 
			selectedChat, 
			isChatVisible, 
			chatUsers, 
			unreadCount,
			activeChats 
		} = useSelector(state => state.chat)

		const handleContextMenu = (e)=>{
	        e.preventDefault();
	        const userName = e.currentTarget.children[0].childNodes[0].childNodes[0].data
	        dispatch(selectChat(userName))
	        setShowMenu(true);
	        setMenuPosition({ x: e.clientX, y: e.clientY })
	  	}
	  const handleLogout = () => {
	  	socket?.current.disconnect();
			dispatch(logout())
		}
	  	const inviteBox = (userName) => {
	    	const userRequest = battleRequest.find(request => request.from == userName )
	    	return userRequest && (
	    			<div /*styles={{height:'200px'}}*/ className="invitation-box">
	                  <span>{userName} te ha invitado a un enfrentamiento</span>
	    							<div><button onClick={()=>handleEmitAcceptBattleRequest(userRequest.roomId)}>Aceptar</button>
	    							<button>Rechazar</button></div>
	    			</div>)
	  	}

	  	const ProfileBox = () => {
	  		const [userStatus, setUserStatus] = useState("En línea");
	  		const [iconIsInHover, setIconIsInHover] = useState(false);
	  		const showPerfilSpanStyle = iconIsInHover ? {marginLeft: "100px", visibility: "visible"} : null

		  	return <div style={{position: "relative"}} className="user-info">
						<div onMouseEnter={()=>setIconIsInHover(true)} onMouseLeave={()=>setIconIsInHover(false)} className="userLevelBarContainer">
							<div className="userLevelBar">
								<div className="icon-border" >
									<img className="user-icon" src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${user.profileIcon}.png`}></img>
								</div>
							</div>
							<div className="user-level">{user.level}</div>
						</div>
						<div className="user-state">
								<div className="user-options">
									<MdOutlineQuestionMark className="accountOptionIcon" />
									<MdMinimize onClick={()=> {dispatch(toggleChatVisibility()); window.innerWidth < 1200 ? setShowSideNav(false) : null }} className="accountOptionIcon" />
									<IoIosSettings className="accountOptionIcon" />
									<PiXBold onClick={()=> handleLogout()} className="accountOptionIcon" />
								</div>
								{!iconIsInHover && <>
									<h3 className="right-nav-username">{user.userName}</h3>
									<div className="user-status" onClick={()=>setUserStatus(prevState=>!prevState)}>
										<div className="status-icon"></div>
										{userStatus ? "En línea" : "Desconectado"}
									</div>
								</>}
						</div> 
						<span className="showPerfilSpan" style={showPerfilSpanStyle}>Ver perfil</span>
				</div>
	  	}
	  	// Update chat users when friends list changes
	  	useEffect(() => {
	  		if (friendsOnline) {
	  			friendsOnline.forEach(folder => {
	  				folder.users.forEach(u => {
	  					if (u.userName !== user.userName) {
	  						dispatch(updateChatUser({
	  							userId: u.userName,
	  							userName: u.userName,
	  							profileIcon: u.profileIcon,
	  							status: 'online',
	  							unreadCount: 0
	  						}))
	  					}
	  				})
	  			})
	  		}
	  	}, [friendsOnline, user.userName, dispatch])

	  	const handleUserClick = (userName) => {
	  		console.log('Opening chat with user:', userName)
	  		
	  		// Find the user in friendsOnline to get their profileIcon
	  		let profileIcon = 1
	  		if (friendsOnline) {
	  			for (const folder of friendsOnline) {
	  				const foundUser = folder.users.find(u => u.userName === userName)
	  				if (foundUser) {
	  					profileIcon = foundUser.profileIcon
	  					break
	  				}
	  			}
	  		}

	  		// Open chat with the selected user
	  		dispatch(openChat({
	  			userId: userName,
	  			userName: userName,
	  			profileIcon: profileIcon
	  		}))
	  		
	  		console.log('Chat opened for user:', userName)
	  	}

	  	const UserFriendList = () => {
	  		const [isFolderOpen, setIsFolderOpen] = useState(true)
	  		const iconStyle = isFolderOpen ? {transform: "rotate(90deg)"} : null
	  		const folderStyle = !isFolderOpen ? {display: "none"} : null

	  		return friendsOnline?.map(folder => (
					<ul className="general-user-list" key={folder.name}>
							<div className="user-folder-name" onClick={()=>{setIsFolderOpen(prevState=>!prevState)}}>
								<VscTriangleRight style={iconStyle} className="triangle"/>
						   				{folder.name.toUpperCase() + " "}({folder.users.length}/{folder.users.length})
							</div>
							<div style={folderStyle}>{folder.users.map(u=>{
							 	return u.userName != user.userName &&(
							 	!battleRequest?.find(br=> br.from == u.userName) ? <li onMouseLeave={()=>offToolTip()} onMouseEnter={(e)=>handleToolTip(e, u)} className="user-box" key={u.userName} onClick={()=>handleUserClick(u.userName)}  onContextMenu={handleContextMenu} >
							 			<div className="icon-border mini">
							 				<img className="user-icon mini" src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${u.profileIcon}.png`}></img>
							 				<div className="box-status-icon"/>
							 			</div>
										<div className="user-box-data">
											<h5>{u.userName}</h5>
											<h5 className="right-nav-status">En linea</h5>
											{chatUsers[u.userName]?.unreadCount > 0 && (
												<span className="unread-badge">{chatUsers[u.userName].unreadCount}</span>
											)}
										</div>
							 	</li> : inviteBox(u.userName) ) 
							})}
			        		</div>
					</ul>))
	  	}


	return <div style={!showSideNav ? {display: 'none'} : null} className="right-nav" onClick={()=>setShowMenu(false)}>
			<ToolTipElement/>
			<ProfileBox/>
			<div className="online-users" >
		      {showMenu && (
		        <div className="custom-menu" style={{position:"fixed", left: menuPosition.x, top: menuPosition.y }}>
		          	<h5 className={selectedChat == user.userName ? "blocked" : null} onClick={()=> {setShowMenu(false); selectedChat != user.userName && handleEmitBattleRequest()}} >Invitar a una partida</h5>
		           	<h5 onClick={()=>setShowMenu(false)}>Ver perfil</h5>
		        </div>
		      )}
					<div className="social-menu">
							SOCIAL 
							<div className="social-icons">
									<BsFillPersonPlusFill className="social-icon"/>
									<BsClipboardPlusFill className="social-icon"/>
									<BsTextRight className="social-icon"/> 
									<BsSearch className="social-icon"/>
							</div>
					</div>
					{UserFriendList()}
			</div>
      <div className="right-nav-buttom-buttons">
      		<button onClick={()=>dispatch(toggleChatVisibility())} className="right-nav-buttom-button">
      			<PiChatCenteredFill />
      			{unreadCount > 0 && <span className="unread-count-badge">{unreadCount}</span>}
      		</button>
      		<button className="right-nav-buttom-button"><RiFilePaper2Fill /></button>
      		<button className="right-nav-buttom-button"><FaMicrophone /></button>
      		<span className="actual-version">25.51.2</span>
      		<button className="right-nav-buttom-button"><MdBugReport /></button>
      </div>

	</div>
})