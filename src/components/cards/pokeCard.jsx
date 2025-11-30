import {react, memo} from 'react'
import { GiDoubled, GiDividedSquare } from "react-icons/gi";
import { GiPadlock } from "react-icons/gi";
import './pokeCard.css'


const pokeCard = ({ id, data, section, onClick })=>{


    return <article id={id} className="pokemon-card" onClick={(event)=>{section == "store" ? onClick() : null}} > {/* Unique key and card class */}
        <img
            className="pokemon "
            id={id} // Set unique ID for potential usage
            src={ `/tiles/${data.id}_0.jpg` }
            alt={`Sprite of ${data.name}`} // Add alt text for accessibility
        />    
            <div className="product-info">
            <h4 className="card-name">{data.name}</h4> 
            <div className="price">
                <div className="rp-price"><img className="w-3.5 h-3.5" src="/general/RP_icon.png"></img><span className="price-number">{data.price.rp}</span></div>
                <div className="essences-price"><img className="w-3.5 h-3.5" src="/general/BE_icon.png"></img><span className="price-number">{data.price.be}</span></div>         
            </div>
            </div>
        <div className="unlock-icon-box"><GiPadlock className="unlock-product-icon" /></div>  
    </article>
}

export default memo(pokeCard)