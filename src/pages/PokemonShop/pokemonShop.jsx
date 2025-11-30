import './pokemonShop.css'
import {react, useState, useEffect, memo, useMemo, useRef} from 'react'
import Card from '../../components/cards/pokeCard.jsx'
import {useSelector, useDispatch} from 'react-redux'
import { selectUserPokemonData } from '../../redux/slices/userPokemonSlice.js';
import {useRouter} from 'next/navigation'
import { BsSearch } from "react-icons/bs"
import { FaCheck } from "react-icons/fa6";
import UseNearScreen from '../../services/UseNearScreen.js'
import useConfirmPurchaseWindow, { ConfirmPurchaseWindowComponent } from '../../components/confirmPurchaseWindow/confirmPurchaseWindow.jsx'
import { updateCoins } from '../../redux/slices/userSlice.js'
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';



export default memo(function PokemonShop(){
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
	//const toggleMenu = () => document.body.classList.toggle("open");
	const [champions, setChampions] = useState([]);
	const [searchKeys, setSearchKeys] = useState()
	const {loading, userChampions, error} = useSelector(selectUserPokemonData);
    const [types, setTypes] = useState()
    const [typeSelected, setTypeSelected] = useState()
    const [generations, setGenerations] = useState()
    const [generationSelected, setGenerationSelected] = useState()
    const [inCollection, setInCollection] = useState(false)
    const [sortedBy, setSortedBy] = useState("")
    const [pokemonFrom, setPokemonFrom] = useState("All")
    const router = useRouter();
    const token = localStorage.getItem('token')
    const externalRef = useRef()
    const {isNearScreen} = UseNearScreen({externalRef: loading ? null : externalRef, once: false})
    const [page, setPage] = useState(0)
    const {
        showWindow,
        productInfo,
        productPrice,
        newBalance,
        buttonStyles,
        buyProduct,
        activateWindow,
        closeWindow
    } = useConfirmPurchaseWindow("pokemon")
    const [sectionSelected, setSectionSelected] = useState('CAMPEONES')
    const sections = [ "CAMPEONES", "ETERNOS", "PAQUETES" ]
    const [championCategory, setChampionCategory] = useState({
        Assassin: false,
        Fighter: false,
        Mage: false,
        Tank: false,
        Marksman: false,
        Support: false,
    })
    const championCategories = [ "Assassin", "Marksman", "Fighter", "Tank", "Support", "Mage" ]

    const championsFiltered = (champions, searchKeys, championCategory, inCollection, sortedBy, userChampions) => {
        const activeRoles = Object.keys(championCategory).filter((role) => championCategory[role]);

        var championsResult = [...champions].filter((champion) => {
          const searchFilter = searchKeys
            ? champion.name.toLowerCase().startsWith(searchKeys.toLowerCase())
            : true;
          const roleFilter = activeRoles.length > 0
            ? activeRoles.every((role) => champion.tags.includes(role))
            : true; // Si no hay roles activos, no filtrar por roles
          const inCollectionFilter = !inCollection ? !userChampions.some(uc => uc.id === champion.id) : true
          return searchFilter && roleFilter && inCollectionFilter;
        });

        if(sortedBy === "AlphabeticallyDescend"){
            championsResult = [...championsResult].sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        }) }
        if(sortedBy === "AlphabeticallyAscend"){
            championsResult = [...championsResult].sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameB.localeCompare(nameA);
        }) }
        if(sortedBy === "PriceRpDescend"){
            championsResult = [...championsResult].sort((a, b) => parseFloat(b.price.rp) - parseFloat(a.price.rp)) 
        }
        if(sortedBy === "PriceRpAscend"){
            championsResult = [...championsResult].sort((a, b) => parseFloat(a.price.rp) - parseFloat(b.price.rp) ) 
        }
        if(sortedBy === "PriceBeDescend"){
            championsResult = [...championsResult].sort((a, b) => parseFloat(b.price.be) - parseFloat(a.price.be)) 
        }
        if(sortedBy === "PriceBeAscend"){
            championsResult = [...championsResult].sort((a, b) => parseFloat(a.price.be) - parseFloat(b.price.be) ) 
        }
        if(sortedBy === "ReleaseAscend"){
            championsResult = [...championsResult].reverse()
        }

        return championsResult

    }

    useEffect(()=>{
        fetch(`${API_URL}pokemons/data/getchamps`)
        .then(response => response.json())
        .then(data => {
            const champs = Object.values(data)
            setChampions(champs); 
        });
    },[])


    useEffect(()=>{
        setPage(prevPage=>prevPage+1)
    },[isNearScreen])
   
    const renderData = useMemo(() => {
        let result = championsFiltered(champions, searchKeys, championCategory, champions, inCollection, sortedBy, userChampions)
        return result
    }, [champions, searchKeys, championCategory, champions, inCollection, sortedBy, userChampions])

    const handleCheckboxChange = (role) => {
        setChampionCategory({
          ...championCategory,
          [role]: !championCategory[role], // Cambia el estado del rol seleccionado
        });
    };

    const LoadPokemon = () => {
        return renderData?.map((c, index) => (
            <Card
                key={c.key || index} // Usar poke.id si está disponible, de lo contrario, index
                id={index}
                data={c}
                section={"store"}
                onClick={()=>activateWindow(c)}
            />
        ));
    };

    return (
            
            <div className="pokemon-shop">
                <ConfirmPurchaseWindowComponent
                    showWindow={showWindow}
                    productInfo={productInfo}
                    productPrice={productPrice}
                    newBalance={newBalance}
                    buttonStyles={buttonStyles}
                    buyProduct={buyProduct}
                    closeWindow={closeWindow}
                    section="pokemon"
                />
                {window.innerWidth > 767 && <div className="filter-nav">

                    <section className="nav-section first">

                        
                        {sections.map(section => {
                            return <div onClick={() => setSectionSelected(section)} className="checkbox section">
                                <div className="custom-checkbox-romb">{sectionSelected === section ? <div className='check-element'></div> : null}</div>
                                <div className={sectionSelected === section ? 'section-selected' : null} > {section} </div>
                            </div>
                        })}
                        
                    </section>
                    <section className="nav-section">
                        
                        <div className="search-filter"><BsSearch className="search-icon" /><input placeholder="Buscar" type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input></div>    
                        <div onClick={()=>setInCollection(prevState => !inCollection)} className="checkbox collection" ><div className="custom-checkbox">{inCollection ? <FaCheck className="check-icon"/> : null}</div>Mostrar en colección</div>

                    </section>
                    <section className="nav-section">
                    
                        <CustomSelect
                            className="select-filter"
                            options={[
                                { value: "", label: "Lanzamiento ⭣" },
                                { value: "ReleaseAscend", label: "Lanzamiento ⭡" },
                                { value: "PriceRpDescend", label: "Precio (RP) ⭣" },
                                { value: "PriceRpAscend", label: "Precio (RP) ⭡" },
                                { value: "PriceBeDescend", label: "Precio (EA) ⭣" },
                                { value: "PriceBeAscend", label: "Precio (EA) ⭡" },
                                { value: "AlphabeticallyDescend", label: "Alfabético ⭣" },
                                { value: "AlphabeticallyAscend", label: "Alfabético ⭡" }
                            ]}
                            value={sortedBy}
                            onChange={setSortedBy}
                            placeholder="Seleccionar orden..."
                        />
                        {championCategories.map(cat => {
                            return <div className="checkbox" onClick={() => handleCheckboxChange(cat)} ><div className="custom-checkbox">{championCategory[cat] ? <FaCheck className="check-icon"/> : null}</div>{cat}</div>
                        })}
                    

                    </section>

                    <section className="nav-section last">

                        <div className="checkbox" ><div className="custom-checkbox"></div>En oferta</div>

                    </section>

                </div>}
                {window.innerWidth < 767 && <div className="filter-nav">


                    <section className="nav-section">
                        
                        <div className="search-filter"><BsSearch className="search-icon" /><input placeholder="Buscar" type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input></div>    
                        <div onClick={()=>setInCollection(prevState => !inCollection)} className="checkbox collection" ><div className="custom-checkbox">{inCollection ? <FaCheck className="check-icon"/> : null}</div>Mostrar en colección</div>

                    </section>
                    

                </div>}
                <div className="grid-pokemon-container">
                    <div className="gradient-layer"></div>
                    {sectionSelected === 'CAMPEONES' ? <main className="pokemon-shop-grid">{LoadPokemon()}<button ref={externalRef}></button></main> : <div className="text-red-800">Proximamente...</div>}
                </div>

            </div>

    )
	
})