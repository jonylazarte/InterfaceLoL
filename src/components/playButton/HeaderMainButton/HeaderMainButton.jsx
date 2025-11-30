import { useState, useEffect } from 'react'
import { selectUserInterfaceData, setActualSection, setUserState } from '@/redux/slices/userInterfaceSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import './HeaderMainButton.css'

export default function PlayButton({setRoomId, socket, modeSelected, okButtonAction}){
    const [isButtonSelected, setIsButtonSelected] = useState(false)
    const dispatch = useDispatch();
    const { actualSection, userState } = useSelector(selectUserInterfaceData);
    const [textInButton, setTextInButton] = useState()

    useEffect(()=>{
        if((userState === 'Explore' || userState === 'Pvp')){
            setTextInButton('GRUPO')
        } else {
            setTextInButton('JUEGA')
        }
        //setTextInButton(text)
    },[userState])



    const handleSound = (sound) => {
        const confirmButtonClick = new Audio('/general/confirm-button-click.mp3');
        const confirmButtonHover = new Audio('/general/confirm-button-hover.mp3');
        const confirmButtonCancelClick = new Audio('/general/confirm-button-cancel-click.mp3');
        const findMatchButtonClick = new Audio('/general/find-match-button-click.mp3');
        const findMatchButtonHover = new Audio('/general/find-match-button-hover.mp3');
        const buttonPlayClick = new Audio('/general/button-play-click.mp3');
        const buttonPlayHover = new Audio('/general/button-play-hover.mp3');

        sound == "confirm-button-click" && confirmButtonClick.play();
        sound == "confirm-button-hover" && confirmButtonHover.play();
        sound == "confirm-button-cancel-click" && confirmButtonCancelClick.play();
        sound == "find-match-button-click" && findMatchButtonClick.play();
        sound == "find-match-button-Hover" && findMatchButtonHover.play();
        sound == "button-play-click" && buttonPlayClick.play();
        sound == "button-play-hover" && buttonPlayHover.play()
    }


    const okButtonClickActions = () => {

            handleSound('button-play-click');

            actualSection != 'ModeSelection' ?
            dispatch(setActualSection("ModeSelection"))
            : null;
    }



	return (
        <div className="lol-main-button">
          <div className="lol-main-button__logo-container">
            <div className="lol-main-button__logo"></div>
          </div>
          <div
            onMouseEnter={() => handleSound('find-match-button-hover')}
                onClick={() => {
                  okButtonClickActions();
                  setIsButtonSelected(true);
                }}
             className={`lol-main-button__action-box ${actualSection === "ModeSelection" ? 'selected' : ''} ${userState !== 'Online' ? 'selected' : ''}`}
           >
            <div className={`lol-main-button__action-border ${actualSection === "ModeSelection" ? 'selected' : ''} ${userState !== 'Online' ? 'selected' : ''}`}>
              <div className={`lol-main-button__action ${actualSection === "ModeSelection" ? 'selected' : ''} ${userState !== 'Online' ? 'selected' : ''}`}>
                  <div
                    className={`lol-main-button__text ${actualSection === "ModeSelection" ? 'selected' : ''} ${userState !== 'Online' ? 'selected' : ''}`}
                  >
                    {textInButton}
                </div>
              </div>
            <div className="header-circunferense"></div>

            </div>
          </div>
        </div>
  )
}