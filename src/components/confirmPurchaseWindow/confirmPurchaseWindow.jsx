import { useSelector, useDispatch } from 'react-redux'
import { useState, useCallback, useMemo } from 'react'
import { LiaLongArrowAltUpSolid } from "react-icons/lia";
import { updateCoins } from '../../redux/slices/userSlice.js';
import { buySkin } from '../../redux/slices/userSkinsSlice.js';
import { addChampion } from '../../redux/slices/userPokemonSlice.js';
import './confirmPurchaseWindow.css'
import {Riple} from 'react-loading-indicators'

// Custom hook for purchase window logic
export default function useConfirmPurchaseWindow(section) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const token = localStorage.getItem('token')
    const [showWindow, setShowWindow] = useState(false)
    const [productInfo, setProductInfo] = useState(null)
    const [isBeingPurchasedWith, setIsBeingPurchasedWith] = useState()

    // Memoized price calculation
    const productPrice = useMemo(() => ({
        rp: productInfo?.price?.rp || productInfo?.value || 0,
        be: productInfo?.price?.be || 0
    }), [productInfo])

    // Memoized balance calculation
    const newBalance = useMemo(() => ({
        rp: user.RP - productPrice.rp,
        be: user.BE - productPrice.be
    }), [user.RP, user.BE, productPrice.rp, productPrice.be])

    // Memoized button styles
    const buttonStyles = useMemo(() => ({
        rp: user.RP - productPrice.rp >= 0 ? null : { filter: "grayscale(0.5)", cursor: "default" },
        be: user.BE - productPrice.be >= 0 ? null : { filter: "grayscale(0.5)", cursor: "default" }
    }), [user.RP, user.BE, productPrice.rp, productPrice.be])

    // Optimized purchase function
    const buyProduct = useCallback(async (coin, price) => {
        if (!productInfo) return

        const body = section === "pokemon" ? {
            userID: token,
            championId: productInfo.id,
            coin,
            price
        } : {
            userId: token,
            skinId: productInfo.id,
            price,
            coin
        }

        try {
            if (section !== "pokemon") {
                /*setIsBeingPurchasedWith(coin);*/
                await dispatch(buySkin(body))
            } else {
                /*setIsBeingPurchasedWith(coin);*/
                await dispatch(addChampion({ championId: productInfo.id, coin, price }))    
            }
            await dispatch(updateCoins({ coin, price }))
            setIsBeingPurchasedWith()
            setShowWindow(false)
        } catch (error) {
            console.error('Purchase failed:', error)
        }
    }, [dispatch, productInfo, section, token])

    // Optimized window activation
    const activateWindow = useCallback((product) => {
        if (!product) return
        
        const productImg = section === "pokemon" 
            ? `/splash/${product.name}_0.jpg` 
            : `/splash/${product.img}`
        
        setProductInfo({ ...product, productImg })
        setShowWindow(true)
    }, [section])

    // Close window function
    const closeWindow = useCallback(() => {
        setShowWindow(false)
        setProductInfo(null)
    }, [])

    return {
        showWindow,
        productInfo,
        productPrice,
        newBalance,
        buttonStyles,
        buyProduct,
        activateWindow,
        closeWindow,
        isBeingPurchasedWith
    }
}

// Separate component for the purchase window UI
export function ConfirmPurchaseWindowComponent({ 
    showWindow, 
    productInfo, 
    productPrice, 
    newBalance, 
    buttonStyles, 
    buyProduct, 
    closeWindow, 
    section,
    isBeingPurchasedWith 
}) {
    if (!showWindow || !productInfo) return null

    return (
        <div className="confirm-purchase-screen">
            <div className="confirm-purchase-window">
                <div className="confirm-purchase-window-content">
                    <button className="exit-button" onClick={closeWindow}>X</button>
                    
                    <div className="image-container">
                        <img 
                            className="product-image" 
                            src={productInfo.productImg}
                            alt={productInfo.name}
                        />
                        <div className="gradient"></div>
                    </div>
                    
                    <div className="product-title">
                        <h2 className="product-name">{productInfo.name?.toUpperCase()}</h2>
                        <span>
                            {section !== "skins" ? productInfo.title : "Elige este nuevo estilo para tu campeón!"}
                        </span>
                    </div>
                    
                    <div className="product-actions">
                        <div className="license-info">
                            Esta compra otorga una licencia para este producto digital. 
                            <a 
                                className="more-info" 
                                href="https://www.riotgames.com/es-419/terms-of-service-LATAM#:~:text=4.1." 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Mas información <LiaLongArrowAltUpSolid className="more-info-icon" />
                            </a>
                        </div>
                        
                        <div className="product-buy-buttons">
                            <div className="button-container">
                                <div 
                                    onClick={() => {
                                        if (newBalance.rp >= 0) {
                                            buyProduct("RP", productPrice.rp)
                                        }
                                    }} 
                                    style={buttonStyles.rp} 
                                    className="buy-rp-button"
                                >
                                    <img className="w-4 h-4 rp-icon" src="/general/RP_icon.png" alt="RP" />
                                    {productPrice.rp}
                                    {isBeingPurchasedWith === 'RP' ? <Riple color="blue" size="large" /> : null}
                                    {newBalance.rp >= 0 ? (
                                        <span className="new-balance">nuevo saldo: {newBalance.rp} RP</span>
                                    ) : (
                                        <span className="new-balance" style={{ color: "red" }}>Saldo insuficiente</span>
                                    )}
                                </div>
                            </div>
                            
                            {section === 'pokemon' && (
                                <div className="button-container">
                                    <div 
                                        onClick={() => {
                                            if (newBalance.be >= 0) {
                                                buyProduct("BE", productPrice.be)
                                            }
                                        }} 
                                        style={buttonStyles.be} 
                                        className="buy-be-button"
                                    >
                                        <img className="w-4 h-4 be-icon" src="/general/BE_icon.png" alt="BE" />
                                        {productPrice.be}
                                        {isBeingPurchasedWith === 'BE' ? <Riple color="blue" size="large" /> : null}
                                        {newBalance.be >= 0 ? (
                                            <span className="new-balance">nuevo saldo: {newBalance.be} EA</span>
                                        ) : (
                                            <span className="new-balance" style={{ color: "red" }}>Saldo insuficiente</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}