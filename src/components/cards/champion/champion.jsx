import {react, memo} from 'react'
import './champion.css'
import { GiPadlock } from "react-icons/gi";
import { GiPadlockOpen } from "react-icons/gi";


const championCard = ({ id, data, section, onClick, adquired })=>{

    const handleClick = () => {
        if (onClick) {
            onClick(data);
        }
    };

    return <article id={id} className="champion-card" onClick={handleClick}> {/* Unique key and card class */}
        <div className="champion-sprites">
            <img
                className="champion-image"
                id={id} // Set unique ID for potential usage
                src={ `/loading/${data.id}_0.jpg` }
                alt={`Sprite of ${data.name}`} // Add alt text for accessibility
            />
            { adquired ? <div className="mastery-box"></div> : <div className="unlock-champion-button"><GiPadlock style={{transform: 'rotate(-45deg)'}} /></div>}
        </div>           
        <h2 className="champion-name">{data.name}</h2>     
    </article>
}

export default memo(championCard)