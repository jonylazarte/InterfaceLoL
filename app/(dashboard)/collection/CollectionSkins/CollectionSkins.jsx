import './CollectionSkins.css'
import { useState, useEffect, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js'
import { BsSearch } from "react-icons/bs"
import { FaCheck } from "react-icons/fa6";
import SkinTooltip from '@/components/ToolTip/skinTooltip/skinTooltip.jsx'
import { GiPadlock } from "react-icons/gi";
import CustomSelect from '@/components/CustomSelect/CustomSelect.jsx';

export default memo(function Pokemon() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //const [pokemon, setPokemon] = useState();
    const { userSkins } = useSelector(selectUserSkinsData);
    const [skins, setSkins] = useState([])
    const raritys = ["Signature", "Hall", "Ultimate", "Mythic", "Legendary", "Epic"];
    const [searchKeys, setSearchKeys] = useState()
    const [groupedBy, setGroupedBy] = useState("collection")
    const [sortedBy, setSortedBy] = useState()
    const [showNotObtained, setShowNotObtained] = useState(false)
    const [userSkinsFull, setUserSkinsFull] = useState([])
    console.log(searchKeys)
    const sortOptionsByMode = {
        collection: [ // collection
            { value: "purchaseDate", label: "Fecha de compra" },
            { value: "releaseDate", label: "Fecha de lanzamiento" },
            { value: "alphabetical", label: "Alfabético" }
        ],
        all: [
            { value: "releaseDate", label: "Fecha de lanzamiento" },
            { value: "alphabetical", label: "Alfabético" }
        ],
        champion: [
            { value: "mastery", label: "Maestría" },
            { value: "mostOwned", label: "Más en colección" },
            { value: "alphabetical", label: "Alfabético" }
        ],
        set: [
            { value: "mostOwned", label: "Más en colección" },
            { value: "alphabetical", label: "Alfabético" }
        ],
        level: [
            { value: "rarity", label: "Nivel (por defecto)" }
        ]
    };

    const countRarity = userSkinsFull.reduce((acc, skin) => {
        acc[skin.rarity] = (acc[skin.rarity] || 0) + 1;
        return acc;
    }, {});

    useEffect(() => {
        fetch(`${API_URL}pokemons/data/skins`)
            .then(response => response.json())
            .then(data => {
                setSkins(data);
                const userSkinsData = userSkins ? userSkins?.map(us => {
                    const respectiveSkinData = data.find(skinData => skinData.id === us.id)
                    return { ...respectiveSkinData, 'purchaseDate': us.purchaseDate }
                }) : [{}]
                userSkinsData.reverse()
                setUserSkinsFull(userSkinsData)
            })
    }, [])

    useEffect(() => {
        const defaultOption = sortOptionsByMode[groupedBy]?.[0]?.value;
        setSortedBy(defaultOption);
    }, [groupedBy]);

    /*function applySearchFilter(groupedSections, searchKeys) {
        if (!searchKeys) return groupedSections;
        const lower = searchKeys.toLowerCase();
        return groupedSections
            .map(([section, skins]) => {
                const filteredSkins = skins.filter(
                    (s) =>
                        s.name.toLowerCase().includes(lower) ||
                        s.champion.toLowerCase().includes(lower)
                );
                return [section, filteredSkins];
            })
            .filter(([, skins]) => skins.length > 0); // eliminar secciones vacías
    }*/

    function groupByAcquisitionYear(skins) {
        return Object.entries(
            skins.reduce((acc, skin) => {
                const year = new Date(skin.purchaseDate).getFullYear();
                acc[year] = acc[year] || [];
                acc[year].push(skin);
                return acc;
            }, {})
        ).sort(([a], [b]) => b - a); // newest → oldest
    }

    function groupByReleaseYear(skins) {
        return Object.entries(
            skins.reduce((acc, skin) => {
                const year = new Date(skin.release).getFullYear();
                acc[year] = acc[year] || [];
                acc[year].push(skin);
                return acc;
            }, {})
        ).sort(([a], [b]) => b - a);
    }

    function groupByChampion(skins) {
        return Object.entries(
            skins.reduce((acc, skin) => {
                acc[skin.champion] = acc[skin.champion] || [];
                acc[skin.champion].push(skin);
                return acc;
            }, {})
        ).sort(([a], [b]) => a.localeCompare(b));
    }

    function groupBySkinline(skins) {
        return Object.entries(
            skins.reduce((acc, skin) => {
                acc[skin.set[0]] = acc[skin.set[0]] || [];
                acc[skin.set[0]].push(skin);
                return acc;
            }, {})
        ).sort(([a], [b]) => a.localeCompare(b));
    }

    function groupByRarity(skins) {
        return Object.entries(
            skins.reduce((acc, skin) => {
                acc[skin.rarity] = acc[skin.rarity] || [];
                acc[skin.rarity].push(skin);
                return acc;
            }, {})
        ).sort(([a], [b]) => a.localeCompare(b));
    }

    function groupByChampionInitial(skins) {
        const grouped = skins.reduce((acc, skin) => {
            const initial = (skin.champion?.[0] || "#").toUpperCase();
            (acc[initial] ||= []).push(skin);
            return acc;
        }, {});
        // siempre devolver array ordenado por inicial
        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    }

    function getGroupedSkins(mode, showNotObtained, allSkins, userSkins) {
        // primero agrupamos SOLO lo del usuario
        let groupedUser;
        switch (mode) {
            case "collection":
                if (sortedBy === "releaseDate") {
                    groupedUser = groupByReleaseYear(userSkins)
                } else if (sortedBy === "alphabetical") {
                    groupedUser = groupByChampionInitial(userSkins);
                } else {
                    groupedUser = groupByAcquisitionYear(userSkins);
                }
                break;
            case "all":
                if (sortedBy === "alphabetical") {
                    groupedUser = groupByChampionInitial(userSkins);
                } else {
                    groupedUser = groupByReleaseYear(userSkins);
                }
                break;
            case "champion":
                groupedUser = groupByChampion(userSkins);
                break;
            case "set":
                groupedUser = groupBySkinline(userSkins);
                break;
            case "level":
                groupedUser = groupByRarity(userSkins);
                break;
            default:
                groupedUser = [];
        }

        // si no hay que mostrar los no obtenidos → listo
        if (!showNotObtained || mode === "") {
            return groupedUser;
        }

        // si hay que mostrar también los no obtenidos
        // eslint-disable-next-line no-undef
        const obtainedIds = new Set(userSkins?.map((s) => s.id));
        const notObtained = allSkins.filter((s) => !obtainedIds.has(s.id));

        let groupedNotObtained;
        switch (mode) {
            case "all":
                if (sortedBy === "alphabetical") {
                    groupedNotObtained = groupByChampionInitial(notObtained);
                } else {
                    groupedNotObtained = groupByReleaseYear(notObtained);
                }
                break;
            case "champion":
                groupedNotObtained = groupByChampion(notObtained);
                break;
            case "set":
                groupedNotObtained = groupBySkinline(notObtained);
                break;
            case "level":
                groupedNotObtained = groupByRarity(notObtained);
                break;
            default:
                groupedNotObtained = [];
        }

        // combinamos: primero obtenidos, luego no obtenidos
        const combined = [];
        // eslint-disable-next-line no-undef
        const mapNotObtained = new Map(groupedNotObtained);
        for (const [section, skins] of groupedUser) {
            const extras = mapNotObtained.get(section) || [];
            combined.push([section, [...skins, ...extras]]);
            mapNotObtained.delete(section);
        }
        for (const [section, skins] of mapNotObtained) {
            combined.push([section, skins]);
        }
        return combined;
    }

    function applySectionSorting(grouped, groupedBy, sortedBy, userSkins) {
        if (!grouped) return [];
        let sortedGrouped = [...grouped];
        switch (sortedBy) {
            case "purchaseDate":
                sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
                break;
            case "releaseDate":
                sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
                break;
            case "alphabetical":
                sortedGrouped.sort(([a], [b]) => a.localeCompare(b));
                break;
            case "mastery":
                sortedGrouped.sort(([, skinsA], [, skinsB]) => {
                    const masteryA = skinsA.reduce((sum, s) => sum + (s.championMastery || 0), 0);
                    const masteryB = skinsB.reduce((sum, s) => sum + (s.championMastery || 0), 0);
                    return masteryB - masteryA;
                });
                break;
            case "mostOwned": {
                // eslint-disable-next-line no-undef
                const obtainedIds = new Set(userSkins?.map((s) => s.id));
                sortedGrouped.sort(([, skinsA], [, skinsB]) => {
                    const ownedA = skinsA.filter((s) => obtainedIds.has(s.id)).length;
                    const ownedB = skinsB.filter((s) => obtainedIds.has(s.id)).length;
                    return ownedB - ownedA;
                });
                break;
            }
            /*case "rarity":
                break;*/
            default:
                break;
        }
        return sortedGrouped;
    }

    const grouped = useMemo(() => {
        const grouped = getGroupedSkins(groupedBy, showNotObtained, skins, userSkinsFull);
        const sectionSorted = applySectionSorting(grouped, groupedBy, sortedBy, userSkins);
        return sectionSorted
    }, [groupedBy, showNotObtained, skins, userSkinsFull, sortedBy]);

    const RenderSkinsBySections = () => {
        const isSkinInCollection = (id) => userSkins?.some(us => us.id === id)
        return grouped.map(([section, skins], index) => (
            <div
                key={section}
                className={`skins-section ${
                    grouped.length - 1 === index ? "" : "border-b border-white/10"
                }`}
            >
                {section !== "Todos" ? (
                    <h1
                        className={`${
                            index === 0 ? "mt-[0.6vh] mb-[3.7vh]" : "mt-[2.3vh] mb-[2.3vh]"
                        } text-lg flex items-center content-center`}
                    >
                        {sortedBy === 'purchaseDate' ? 'ADQUIRIDO EL '
                            : sortedBy === 'releaseDate' ? 'LANZADO EL '
                                : null}
                        {section.toUpperCase()}
                    </h1>
                ) : null}
                <div className="skins-grid">
                    {skins.length > 0
                        ? skins.map((skin) => (
                            <SkinTooltip key={skin.id} delay={100} content={{ skinName: skin.name, purchaseDate: skin.purchaseDate, chromas: skin.chromas, skinRarity: skin.rarity, inCollection: isSkinInCollection(skin.id), value: skin.value }} position="top">
                                <div key={skin.id} className={`skin-card ${isSkinInCollection(skin.id) ? null : 'not-obtained'}`}>
                                    <img
                                        key={skin.id}
                                        className={`skin-card-image ${isSkinInCollection(skin.id) ? null : 'not-obtained'}`}
                                        src={`/loading/${skin.img}`}
                                        alt={skin.name}
                                    />
                                    {isSkinInCollection(skin.id) ?
                                        <>{
                                            skin.rarity !== 'NoRarity' ?
                                                <img
                                                    className="skin-card-rarity-image"
                                                    src={`/raritys/${skin.rarity}.png`}
                                                    alt={skin.rarity}
                                                />
                                                : null
                                        }</>
                                        : <div className="unlock-champion-button">
                                            <GiPadlock style={{ transform: 'rotate(-45deg)' }} />
                                        </div>
                                    }
                                </div>
                            </SkinTooltip>
                        ))
                        : null}
                </div>
            </div>
        ));
    };

    return <section className="collection-skins-section">
        <div className="skins-panel">
            <div className="left-place">
                <div className="skins-panel-stats ">
                    <svg className="hextech-rounded-border" id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184 211.41">
                        <g id="Meters">
                            <g>
                                <path className="cls-3" d="M97.78,35.63l-5.78,5.78-5.78-5.78C42.53,38.61,8,74.97,8,119.41s37.61,84,84,84,84-37.61,84-84-34.53-80.81-78.22-83.78Z"/>
                                <path className="cls-2" d="M104.19,29.23l-12.19,12.19-12.19-12.19C35.32,35.18,1,73.29,1,119.41c0,50.26,40.74,91,91,91s91-40.74,91-91c0-46.13-34.32-84.23-78.81-90.19Z"/>
                                <rect className="cls-1" x="88.46" y="17.88" width="7.07" height="7.07" transform="translate(11.8 71.33) rotate(-45)"/>
                            </g>
                        </g>
                    </svg>
                    <div className="total-skins-info">
                        <div className="amount">{userSkins?.length}</div>
                        <div className="description">TOTAL DE ASPECTOS EN COLECCIÓN</div>
                    </div>
                    <svg className="skins-hextech-border" id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170.3 192.39">
                        <defs></defs>
                        <g id="Containers">
                            <g>
                                <g>
                                    <path className="cls-1" d="M.5,6.47c3.31,0,6-2.67,6-5.97h157.3c0,3.3,2.69,5.97,6,5.97"/>
                                    <path className="cls-1" d="M11.36,188.16c-1.55-4.48-5.82-7.71-10.86-7.71V12.19c5.04,0,9.31-3.22,10.86-7.71"/>
                                    <path className="cls-1" d="M169.8,185.92c-3.31,0-6,2.67-6,5.97H6.5c0-3.3-2.69-5.97-6-5.97"/>
                                    <path className="cls-1" d="M158.95,4.23c1.55,4.48,5.82,7.71,10.86,7.71v168.26c-5.04,0-9.31,3.22-10.86,7.71"/>
                                </g>
                            </g>
                        </g>
                    </svg>

                    <div className="rarity-icons-container">
                        <div className="rarity-icons">
                            {raritys.map((rarity, index) =>
                                <div key={index} className="rarity-item">
                                    <img className="rarity-image" src={`/raritys/${rarity}.png`}></img>
                                    {countRarity[rarity] || '0'}
                                </div>
                            )}
                        </div>
                        <div className="legacy-chromas-icons">
                            <div className="legacy-item">
                                <img className="rariry-image w-7" src='/raritys/Legacy.png'></img>
                                {countRarity['NoRarity']}
                            </div>
                            <div className="chroma-item">
                                <img className="rariry-image w-7" src='/raritys/Chroma.png'></img>
                                0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right-place">
                <div className="search-filter">
                    <BsSearch className="search-icon" />
                    <input placeholder="Buscar" type="search" onKeyUp={(event) => setSearchKeys(event.currentTarget.value)}></input>
                </div>
                <div className="checkbox-container">
                    {groupedBy != 'collection' ? <div
                        className="checkbox"
                        onClick={() => setShowNotObtained(prevState => !prevState)}
                    >
                        <div className="custom-checkbox" type="checkbox">
                            {showNotObtained ? <FaCheck className="check-icon"/> : null}
                        </div>
                        Mostrar no obtenidos
                    </div> : <div className="h-3"></div>}
                </div>
                <CustomSelect
                    className="select-filter"
                    options={[
                        { value: "collection", label: "Mi colección" },
                        { value: "all", label: "Todos" },
                        { value: "champion", label: "Campeón" },
                        { value: "set", label: "Set" },
                        { value: "level", label: "Nivel" }
                    ]}
                    value={groupedBy}
                    onChange={setGroupedBy}
                    placeholder="Seleccionar agrupación..."
                />
                <CustomSelect
                    className="select-filter"
                    options={sortOptionsByMode[groupedBy] || []}
                    value={sortedBy}
                    onChange={setSortedBy}
                    placeholder="Seleccionar orden..."
                />
            </div>
        </div>
        <div className="skins-grid-container">
            <RenderSkinsBySections />
        </div>
    </section>
})
