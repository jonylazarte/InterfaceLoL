import {useState, useEffect, useMemo, memo} from 'react'
import {useSelector} from 'react-redux'
import { BsSearch } from "react-icons/bs"
import { FaCheck } from "react-icons/fa6";
import './itemsShop.css';
import useConfirmPurchaseWindow, { ConfirmPurchaseWindowComponent } from '@/components/confirmPurchaseWindow/confirmPurchaseWindow.jsx'
import { selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js';
import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';
import Image from 'next/image'
import CustomSelect from '@/components/CustomSelect/CustomSelect.jsx';

export default memo(function ItemsShop(){
	const API_URL = process.env.NEXT_PUBLIC_API_URL
	const [items, setItems] = useState([])
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
	const [searchKeys, setSearchKeys] = useState()
    const [types, setTypes] = useState()
    const [typeSelected, setTypeSelected] = useState()
    const [pokemonFrom, setPokemonFrom] = useState("All")
    const [inCollection, setInCollection] = useState(false)
    const [championInCollection, setChampionInCollection] = useState(false)
    const [checkboxFilter, setCheckboxFilter] = useState({
        Limited: false,
        Legendary: false,
        Ultimate: false
    })
    const [sortedBy, setSortedBy] = useState()
    const {
        showWindow,
        productInfo,
        productPrice,
        newBalance,
        buttonStyles,
        buyProduct,
        activateWindow,
        closeWindow
    } = useConfirmPurchaseWindow("skins")
    const {loading, userSkins} = useSelector(selectUserSkinsData);
    const { userChampions } = useSelector(selectUserPokemonData);
    const sections = [ "ASPECTOS", "CHROMAS", "PAQUETES" ]
    const [sectionSelected, setSectionSelected] = useState("ASPECTOS")
    const checkBoxFilters = ["Limited", "Legendary", "Ultimate"] 

	useEffect(()=>{
		fetch(`${API_URL}pokemons/data/skins`)
        .then(response=>response.json())
        .then(data=>{
            setItems(data);
            /*const filteredSkins = data.filter(skin => !userSkins?.some(us => us.id === skin.id));*/
        })
	},[loading])

    const filterSkins = (items, searchKeys, inCollection, sortedBy, championInCollection, checkboxFilter, userSkins) => {
        const activeCheckBox = Object.keys(checkboxFilter).filter(rarity => checkboxFilter[rarity])
        let itemsFiltered = items.filter(item =>{
        const keyFilter = searchKeys ? item.name.toLowerCase().startsWith(searchKeys.toLowerCase()) : true;
        const showInCollectionFilter = !inCollection && userSkins?.length != 0 ? !userSkins?.some(us => us.id == item.id) : true;
        const championInCollectionFilter = championInCollection ? userChampions.some(uc => uc.id.toLowerCase() === item.champion.toLowerCase()) : true;
        const rarityFilter = activeCheckBox.length > 0
        ? activeCheckBox.every(rarity => rarity !== 'Limited' ? item.rarity === rarity : item.availability === 'Limited')
        : true;
        const limitedAvailabilityFilter = !activeCheckBox.some(ac => ac === "Limited") ? item.availability === 'Available' : true 
        return keyFilter && showInCollectionFilter && championInCollectionFilter && rarityFilter && limitedAvailabilityFilter;
        })
        if(sortedBy === "alphabetically descend"){
            itemsFiltered = [...itemsFiltered].sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase())) 
        }
        if(sortedBy === "alphabetically ascend"){
            itemsFiltered = [...itemsFiltered].sort((a, b) => b.name.toUpperCase().localeCompare(a.name.toUpperCase())) 
        }
        if(sortedBy === "PriceRpDescend"){
            itemsFiltered = [...itemsFiltered].sort((a, b) => parseFloat(b.value) - parseFloat(a.value)) 
        }
        if(sortedBy === "PriceRpAscend"){
            itemsFiltered = [...itemsFiltered].sort((a, b) => parseFloat(a.value) - parseFloat(b.value) ) 
        }
        if(sortedBy === "ReleaseAscend"){
            itemsFiltered = [...itemsFiltered].reverse()
        }
        return itemsFiltered.splice(0,200)
    }


    const handleCheckboxChange = (rarity) => {
        setCheckboxFilter({
          ...checkboxFilter,
          [rarity]: !checkboxFilter[rarity],
        });
    };

    const renderData = useMemo(() => {
        let result = filterSkins(items, searchKeys, inCollection, sortedBy, championInCollection, checkboxFilter, userSkins)
        return result
    }, [items, searchKeys, inCollection, sortedBy, championInCollection, checkboxFilter, userSkins])
    const RenderCards = memo(() => {
        return renderData?.map( (skin, index) => <article key={skin.id || index} onClick={()=>activateWindow(skin)}>
                                <Image className="skin-card-image"
                                    src={`/tiles/${skin.img}`}
                                    fill={true}
                                    style={{ objectFit: 'cover' }}
                                    alt={skin.id}
                                    sizes= "23vw"
                                />
                                <div className="product-info">
                                    <h4 className="card-name">{skin.name}</h4>
                                    <div className="price">
                                        <div className="rp-price">
                                            {skin.availability !== 'Limited' ? <img className="w-3.5 h-3.5" src="/general/RP_icon.png"></img> : null}
                                            <span className="price-number"> {skin.value} </span>
                                        </div>
                                    </div>
                                </div>
                            </article> )
    })

	return (
		<div className="items-section">
                <ConfirmPurchaseWindowComponent
                    showWindow={showWindow}
                    productInfo={productInfo}
                    productPrice={productPrice}
                    newBalance={newBalance}
                    buttonStyles={buttonStyles}
                    buyProduct={buyProduct}
                    closeWindow={closeWindow}
                    section="skins"
                />
				{window.innerWidth > 767 && <div className="filter-nav">
                    <section className="nav-section first">
                        {sections.map(section => {
                            return <div key={section} onClick={() => setSectionSelected(section)} className="checkbox section">
                                <div className="custom-checkbox-romb">{sectionSelected === section ? <div className='check-element'></div> : null}</div>
                                <div className={sectionSelected === section ? 'section-selected' : null} > {section} </div>
                            </div>
                        })}
                    </section>
                    <section className="nav-section">
                        <div className="search-filter"><BsSearch className="search-icon"/><input placeholder="Buscar" type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input></div>
                    
                        <div onClick={()=>setInCollection(!inCollection)} className="checkbox collection" ><div className="custom-checkbox">{inCollection ? <FaCheck className="check-icon"/> : null}</div>Mostrar en colección</div>
          
                    </section>
                    <section className="nav-section">
                        <CustomSelect
                            className="select-filter"
                            options={[
                                { value: "", label: "Lanzamiento ⭣" },
                                { value: "ReleaseAscend", label: "Lanzamiento ⭡" },
                                { value: "PriceRpDescend", label: "Precio(RP) ⭣" },
                                { value: "PriceRpAscend", label: "Precio(RP) ⭡" },
                                { value: "alphabetically descend", label: "Alfabético ⭣" },
                                { value: "alphabetically ascend", label: "Alfabético ⭡" },
                                { value: "champsDescend", label: "Campeones ⭣" },
                                { value: "champsAscend", label: "Campeones ⭡" }
                            ]}
                            value={sortedBy}
                            onChange={setSortedBy}
                            placeholder="Seleccionar orden..."
                        />
           
                       	<div className="checkbox" onClick={() => setChampionInCollection(prevState=> !prevState)}>
                            <div  className="custom-checkbox" >
                                {championInCollection ? <FaCheck className="check-icon"/> : null}
                            </div>
                            Campeón en colección
                        </div>

                    </section>
                    <section className="nav-section">
                        {checkBoxFilters.map(checkbox => {
                            return <div key={checkbox} className="checkbox" onClick={() => handleCheckboxChange(checkbox)} >
                                <div className="custom-checkbox">
                                {checkboxFilter[checkbox] ? <FaCheck className="check-icon"/> : null}
                                </div>
                                {checkbox === 'Limited' ? 'Disp. Limitada' :
                                checkbox === 'Legendary' ? 'Legendario' :
                                checkbox === 'Ultimate' ? 'Definitivo' : null
                                }
                            </div>
                        })}
                    </section>
                    <section className="nav-section last">
           
                        <div className="checkbox"><div className="custom-checkbox" ></div>En oferta</div>

                    </section>
                </div>}

                {window.innerWidth < 767 && <div className="filter-nav">


                    <section className="nav-section">
                        
                        <div className="search-filter"><BsSearch className="search-icon" /><input placeholder="Buscar" type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input></div>    
                        <div onClick={()=>setInCollection(prevState => !inCollection)} className="checkbox collection" ><div className="custom-checkbox">{inCollection ? <FaCheck className="check-icon"/> : null}</div>Mostrar en colección</div>

                    </section>
                    

                </div>}
				<div className="items-grid-container">
                    <div className="items">
					   <RenderCards />
				    </div>
                </div>
			</div>)
})