import './styles.css'
import {react, useState, useEffect, memo, useMemo, useRef} from 'react'
import Card from '../../components/cards/champion/champion.jsx'
import {useSelector, useDispatch} from 'react-redux'
import { selectUserPokemonData } from '../../redux/slices/userPokemonSlice.js';
import {useRouter} from 'next/navigation'
import { BsSearch } from "react-icons/bs"
import { FaCheck } from "react-icons/fa6";
import UseNearScreen from '../../services/UseNearScreen.js'
import ToolTip from '@/components/ToolTip/ToolTip.jsx';
import ChampionDetailModal from '../../components/ChampionDetailModal/ChampionDetailModal.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';



export default memo(function MainPage(){
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
	//const toggleMenu = () => document.body.classList.toggle("open");
	const [pokemon, setPokemon] = useState([]);
    const [championFull, setChampionFull] = useState([]); 
	const [searchKeys, setSearchKeys] = useState()
	const {loading, userChampions, error} = useSelector(selectUserPokemonData)
    /*const [skins, setSkins] = useState([])*/
    const [types, setTypes] = useState()
    const [typeSelected, setTypeSelected] = useState()
    const [generations, setGenerations] = useState()
    const [generationSelected, setGenerationSelected] = useState()
    const [inCollection, setInCollection] = useState(true)
    const [sortedBy, setSortedBy] = useState("")
    const [groupedBy, setGroupedBy] = useState("")
    const [selectedChampion, setSelectedChampion] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    	const router = useRouter();
    const token = localStorage.getItem('token')
    const externalRef = useRef()
    const {isNearScreen} = UseNearScreen({externalRef: loading ? null : externalRef, once: false})
    const [page, setPage] = useState(0)
  
  	/*useEffect(()=>{
  		pokemonFrom == "All" && fetch(`${API_URL}pokemons/${pokemonFrom == "User" ? "users/pokemon" : ""}`)
    	.then(response => response.json())
    	.then(data => {
            setPokemon(data); setRenderData(data); 
        });

        pokemonFrom == "User" && fetch(`${API_URL}pokemons/users/pokemon`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id : token })
        })
        .then(response => response.json())
        .then(data => {
            setPokemon(data); setRenderData(data); 
        });
  	},[pokemonFrom])*/
    useEffect(()=>{
        fetch(`${API_URL}pokemons/data/getchamps`)
        .then(response => response.json())
        .then(data => {
            const champs = Object.values(data)
            setPokemon( champs );
            /*const adquiredChamps = champs.filter(c => userChampions.some(uc => uc.id === c.id))
            setRenderData({ 'Todos': adquiredChamps}); */
        });
        fetch(`${API_URL}pokemons/data/championFull`)
        .then(response => response.json())
        .then(data => {
            setChampionFull(data)
        });
        
    },[userChampions])

    const groupChamps = (champs, allChamps) => {

        const byRole = champs?.reduce(( acumulador, campeon) => {
            if(!acumulador[campeon.tags[0]]){
                acumulador[campeon.tags[0]] = [];
            }
            acumulador[campeon.tags[0]].push(campeon)
            return acumulador
        }, {})
        var byPossession = {
            'En colección': [],
            'No adquiridos': [],
        }
        allChamps?.map(( campeon ) => {
            /*!acumulador['En colección'] ? acumulador['En colección'] = []
            !acumulador['No adquiridos'] ? acumulador['No adquiridos'] = []*/
            userChampions.some( c => c.id === campeon.id ) ? byPossession['En colección'].push(campeon) : byPossession['No adquiridos'].push(campeon)

        })

        var all = {
            'Todos': champs,
        }

        switch(groupedBy){
        case 'role':
            return byRole
            break;
        case 'possession':
            return byPossession
            break;
        default:
            return all
        }

    }

    const filterPokemon = (allChamps, searchKeys, inCollection, sortedBy, groupedBy, page ) => {
        var pokemonFiltered = allChamps?.filter(champ => {
                const inCollectionFilter = inCollection ? userChampions.some(uc => uc.id == champ.id) : true
                const keysFilter = searchKeys ? champ.name.toLowerCase().startsWith(searchKeys.toLowerCase()) : true

                return inCollectionFilter && keysFilter
        })
        pokemonFiltered = groupChamps(pokemonFiltered, allChamps)
        if(sortedBy === "alphabetically descend"){
            sectionFiltered.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        }) }
        if(sortedBy === "alphabetically ascend"){
            sectionFiltered.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameB.localeCompare(nameA);
        }) }
        return pokemonFiltered
    }
    

    useEffect(()=>{
        setPage(prevPage=>prevPage+1)
    },[isNearScreen])

    const handleChampionClick = (champion) => {
        setSelectedChampion(championFull[champion.id]);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedChampion(null);
    };

    const LoadPokemon = () => {
        return renderData?.map((c, index) => (
            <Card
                key={c.id || index} // Usar poke.id si está disponible, de lo contrario, index
                id={index}
                data={c}
            />
        ));
    };

    const renderData = useMemo(() => {
        let result = filterPokemon(pokemon, searchKeys, inCollection, sortedBy, groupedBy, page)
        return result
    }, [pokemon, searchKeys, inCollection, sortedBy, groupedBy, page])

    const RenderChampsWithSections = () => {
        return Object.keys(renderData)?.map((section, index) => (
            <div className={`champion-section ${Object.keys(renderData).length -1 == index ? null :"border-b border-white/10" }`}>
                {section != 'Todos' ? <h1 className={`${ index === 0 ? 'mt-[0.6vh] mb-[3.2vh]' : 'mt-[2.3vh] mb-[2.3vh]'}  text-lg flex items-center content-center`}>{section.toUpperCase()}</h1> : null }
                <main>
                    {renderData[section].length > 0 ? renderData[section]?.map((c, index) => (
                         <ToolTip delay={100} content={{'championName': c.name, 'maestryLevel': 1, 'masteryPoints': 0, 'maxSeasonRating': 'N/D', 'startInfo': 'A', 'eternals': ["Serie 1", "Serie 2", "Serie Inicial"], 'freeToPlay': false }} position="right">
                                <Card
                                    key={c.id || index} // Usar poke.id si está disponible, de lo contrario, index
                                    id={index}
                                    data={c}
                                    adquired={ userChampions.some(uc => uc.key == c.key) ? true : false}
                                    onClick={handleChampionClick}
                                /> 
                        </ToolTip>
                    )) : null }
                </main>
            </div>
        ));
    }

    const checkboxStyle = inCollection ? {backgroundColor: "white"} : null;
    return (

        <div className="pokedex-container">

            <div className="Pokedex">

                <div className="filter-nav">
                    <div className="left-place"><div className="maestry-etern-levels-container">
                        <svg className="hextech-border" id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243.62 224.22">
                          <g  id="Containers">
                            <g>
                              <path class="cls-1" d="M1,7.93c4.73,0,8.56-3.1,8.56-6.93h224.49c0,3.83,3.83,6.93,8.56,6.93"/>
                              <path class="cls-1" d="M16.5,218.88c-2.22-5.21-8.31-8.95-15.5-8.95V14.57c7.19,0,13.28-3.74,15.5-8.95"/>
                              <path class="cls-1 resalted" d="M242.62,216.29c-4.73,0-8.56,3.1-8.56,6.93H9.56c0-3.83-3.83-6.93-8.56-6.93"/>
                              <path class="cls-1" d="M227.12,5.33c2.22,5.21,8.31,8.95,15.5,8.95v195.36c-7.19,0-13.28,3.74-15.5,8.95"/>
                            </g>
                          </g>
                        </svg>
                        <div className="maestry-etern-levels">
                            <div className="amount-and-description" >
                                <div className="amount">541</div>
                                <div className="description">NIVEL TOTAL DE MAESTRIA</div>
                            </div>
                            <div className="amount-and-description" >
                                <div className="amount">15</div>
                                <div className="description">METAS DE ETERNOS</div>
                            </div>
                        </div>
                    </div></div>
                    <div className="right-place">
                        <div className="search-filter">
                            <BsSearch className="search-icon" />
                            <input placeholder="Buscar" type="search" onKeyUp={(event)=>setSearchKeys(event.currentTarget.value)}></input>
                        </div>
                    
                    { groupedBy != 'possession' ? <div 
                    className="checkbox" 
                    onClick={()=>setInCollection(prevState=>!prevState)}
                    >
                        <div className="custom-checkbox" type="checkbox">
                            { !inCollection ? <FaCheck className="check-icon"/> : null}
                        </div>
                        Mostrar no obtenidos
                    </div> : <div className="h-3"></div>}

                    <CustomSelect
                        className="select-filter"
                        options={[
                            { value: "", label: "Todos los campeones" },
                            { value: "possession", label: "Posesión" },
                            { value: "role", label: "Rol" }
                        ]}
                        value={groupedBy}
                        onChange={setGroupedBy}
                        placeholder="Seleccionar agrupación..."
                    />
                    

                    <CustomSelect
                        className="select-filter"
                        options={[
                            { value: "alphabetically", label: "Alfabético" },
                            { value: "championsMastery", label: "Maestria de campeones" }
                        ]}
                        value={sortedBy}
                        onChange={setSortedBy}
                        placeholder="Seleccionar orden..."
                    />
                    </div>
                </div>

                <div className="grid-pokemon-container">
                    <div className="flex flex-col w-full"><RenderChampsWithSections/></div>       
                </div>

            </div>

            {/* Champion Detail Modal */}
            <ChampionDetailModal
                champion={selectedChampion}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

        </div>
    )
	
})
