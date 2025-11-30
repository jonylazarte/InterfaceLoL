import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";
import styles from './ChampionDetailModal.module.css';
import './ChampionDetailModal.css';
import {useSelector, useDispatch} from 'react-redux'
import { selectUserPokemonData } from '@/redux/slices/userPokemonSlice.js';
import { selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js';
import { GiStripedSword } from "react-icons/gi";
import { GrVulnerability } from "react-icons/gr";
import { LuSwords } from "react-icons/lu";
import { GiShield } from "react-icons/gi";
import { TiSpiral } from "react-icons/ti";
import { PiSpiralBold } from "react-icons/pi";
import { GiMetalBoot } from "react-icons/gi";
import { IoMdTrophy } from "react-icons/io";

/*aspectos imports*/
import { GiPadlock } from "react-icons/gi";

const ChampionDetailModal = ({ champion, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [selectedSkin, setSelectedSkin] = useState(0)
  const [isChampionInCollection, setIsChampionInCollection] = useState()
  const {userChampions} = useSelector(selectUserPokemonData)
  const {userSkins} = useSelector(selectUserSkinsData)

  useEffect(() => {
    if(userChampions && champion) {
      setIsChampionInCollection(userChampions?.some(c => c.id == champion.id))
    }
  }, [champion])

  if (!isOpen || !champion) return null;

  const tabs = window.innerWidth > 767 ? [
    { id: 'resumen', label: 'RESUMEN' },
    { id: 'habilidades', label: 'HABILIDADES' },
    { id: 'maestria', label: 'MAESTRÍA' },
    { id: 'eternos', label: 'ETERNOS' },
    { id: 'aspectos', label: 'ASPECTOS' }
  ] : [
    { id: 'resumen', label: 'RESUMEN' },
    { id: 'habilidades', label: 'HABILIDADES' },
    { id: 'aspectos', label: 'ASPECTOS' }
  ]

  const stats = [
    { name: 'Ataque', value: 13, icon: <LuSwords /> },
    { name: 'Defensa', value: 13, icon: <GiShield /> },
    { name: 'Utilidad', value: 13, icon: <PiSpiralBold /> },
    { name: 'Magia', value: 13, icon: <IoMdTrophy /> },
    { name: 'Movilidad', value: 13, icon: <GiMetalBoot /> },
  ];

  const maxStatValue = 10;
  const championImg = `url('/${activeTab === 'resumen' ? 'centered' : 'splash'}/${champion.id}_0.jpg')`
  const skinFileName = `${champion.id}_` 

  const Resumen = () => {
    const difficulty = champion?.info.difficulty;
    return <>
      {/* Content */}
        <div style={{backgroundImage: championImg}} className={styles.content}>
          {/* Left Panel - Information */}
          <div className={styles.leftPanel}>
            <div className={styles.graphics}>
              <div className={styles.info}>
                
                <div className={styles.damageType}>
                  <span className={styles.damageLabel}>DAÑO:</span>
                  <span className={styles.damageValue}>Mixto</span>
                </div>

                <div className={styles.styleSection}>
                  <span className={styles.styleLabel}>ESTILO:</span>
                  <div className={styles.styleSlider}>
                    <span className={styles.meleeIcon}><GiStripedSword /></span>
                    <div className={styles.sliderTrack}>
                      <div className={styles.sliderThumb} style={{ left: '40%' }}></div>
                    </div>
                    <span className={styles.rangedIcon}><GrVulnerability /></span>
                  </div>
                </div>

                <div className={styles.difficultySection}>
                  <span className={styles.difficultyLabel}>DIFICULTAD:</span>
                  <div className={styles.difficultyBar}>
                    <div className={styles.difficultyLevelOne}></div>
                    {difficulty > 4 ? <div className={styles.difficultyLevelTwo}></div> : null}
                    {difficulty > 7 ? <div className={styles.difficultyLevelThree}></div> : null}
                  </div>
                </div>

              </div>

              <div className={styles.statsRadar}>
                <div className={styles.radarChart}>
                  {stats.map((stat, index) => {
                    const angle = (index * 60) * (Math.PI / 180);
                    const radius = (stat.value / maxStatValue) * 60;
                    const x = 80 + radius * Math.cos(angle);
                    const y = 80 + radius * Math.sin(angle);
                    
                    return (
                      <div key={stat.name} className={styles.statPoint} style={{ left: x, top: y }}>
                        <span className={styles.statIcon}>{stat.icon}</span>
                      </div>
                    );
                  })}
                  <div className={styles.radarBackground}></div>
                </div>

              </div>
              
            </div>       

            <div className={styles.loreSection}>
              <p className={styles.loreText}>
                Entre los secretos guerreros jonios conocidos como los Kinkou, Shen sirve como su líder, el Ojo del Crepúsculo. Desea mantenerse libre de las confusiones que provocan la emoción, los prejuicios y el ego, y camina por la senda oculta del juicio imparcial entre el mundo espiritual y el mundo real. Al estar encargado del balance entre ellos, Shen blande hojas de acero y energía arcana contra cualquiera que lo amenace.
              </p>
            </div>

            <div className={styles.actionButtons}>
              {isChampionInCollection ? <button className="general-button disabled">
                EN COLECCIÓN
              </button> : <button className="general-button"> DESBLOQUEAR </button>}
              <button onClick={() => { window.open(`https://www.leagueoflegends.com/es-es/champions/${champion.id.toLowerCase()}/`, "_blank", "noopener,noreferrer"); }} className="general-button">
                SABER MÁS
                <IoArrowForward />
              </button>
            </div>
          </div>

          {/* Right Panel - Champion Illustration */}
          <div className={styles.rightPanel}>
            <div className={styles.championIllustration}>
              <img 
                src={`/splash/${champion.id}_0.jpg`} 
                alt={champion.name}
                className={styles.illustrationImage}
              />
              <div className={styles.energyEffects}></div>
            </div>
          </div>
        </div>
    </>
  }

  const Aspectos = () => {
    const isSkinInCollection = selectedSkin === 0 || userSkins.some(us => us.key == champion.skins[selectedSkin].id)
    const isThisSkinInCollection = (skinContextIndex) => {  return skinContextIndex == 0 || userSkins.some( us => us.key == champion.skins[skinContextIndex].id) }
    // Función para obtener las skins que deben mostrarse en cada posición
    const getVisibleSkins = () => {
      // Esto debería venir como prop del campeón, pero por ahora asumimos que hay skins 0-4
      const totalSkins = champion.skins.length
      const visibleSkins = [];
      
      // Si hay 5 o menos skins, mostrar todas las disponibles
      if (totalSkins <= 5) {
        const slotsToShow = Math.min(5, totalSkins);
        
        // Calcular el offset para centrar las skins disponibles
        const offset = Math.floor((5 - slotsToShow) / 2);
        
        for (let i = 0; i < 5; i++) {
          if (i >= offset && i < offset + slotsToShow) {
            // Mostrar una skin real
            const skinIndex = i - offset;
            visibleSkins.push(skinIndex);
          } else {
            // Slot vacío
            visibleSkins.push(null);
          }
        }
        return visibleSkins;
      }
      
      // Para campeones con más de 5 skins, usar el carrusel completo
      const carouselPositions = [0, 1, 2, 3, 4];
      
      carouselPositions.forEach((position, index) => {
        // La posición 2 (centro) siempre debe mostrar la skin seleccionada
        if (index === 2) {
          visibleSkins.push(selectedSkin);
        } else {
          // Para las otras posiciones, calcular la skin relativa a la seleccionada
          let skinIndex;
          if (index < 2) {
            // Posiciones a la izquierda del centro
            skinIndex = selectedSkin - (2 - index);
            if (skinIndex < 0) skinIndex += totalSkins;
          } else {
            // Posiciones a la derecha del centro
            skinIndex = selectedSkin + (index - 2);
            if (skinIndex >= totalSkins) skinIndex -= totalSkins;
          }
          visibleSkins.push(skinIndex);
        }
      });
      
      return visibleSkins;
    };

    // Funciones para navegar con las flechas
    const goToPreviousSkin = () => {
      const totalSkins = champion.skins.length
      setSelectedSkin((prev) => (prev - 1 + totalSkins) % totalSkins);
    };

    const goToNextSkin = () => {
      const totalSkins = champion.skins.length
      setSelectedSkin((prev) => (prev + 1) % totalSkins);
    };

    // Manejar navegación con teclado
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (activeTab === 'aspectos') {
          switch (event.key) {
            case 'ArrowLeft':
              event.preventDefault();
              goToPreviousSkin();
              break;
            case 'ArrowRight':
              event.preventDefault();
              goToNextSkin();
              break;
            default:
              break;
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, selectedSkin]);

    const visibleSkins = getVisibleSkins();
    const totalSkins = champion.skins.length

    return <>
      <div className="content" style={{backgroundImage: `url(/${ window.innerWidth < 767 ? 'loading' : 'splash'}/${champion.id}_${champion.skins[selectedSkin].num}.jpg)`}}>
        <div className="bottom-panel">
          <h3 className="skin-name"> {selectedSkin != 0 ? champion.skins[selectedSkin].name : champion.name} </h3>
          <div className="skin-navigator">
            <div className="navigator-line"></div>
            <div className="minibuttons-container">
              {champion.skins.map((_, index) => 
              (<div onClick={() => setSelectedSkin(index)} className={`navigator-minibutton ${index == selectedSkin ? 'active' : null}`}></div>))}
            </div>  
            <div className="navigator-line"></div>
          </div>
          <div className="actions">
            { isSkinInCollection ? <div className="unlock-button disabled"> EN COLECCION </div> : <div className="unlock-button"> DESBLOQUEAR </div>}
            <div className="skin-changer">
              {/*<button 
                className="arrow-icon" 
                onClick={goToPreviousSkin}
                aria-label="Skin anterior"
                title="Skin anterior (←)"
                disabled={totalSkins <= 1}
                style={{ opacity: totalSkins <= 1 ? 0.5 : 1 }}
              >
                ←
              </button>*/}
              <div className="skin-minicards-container">
                {visibleSkins.map((skinIndex, position) => (
                  <div 
                    key={`${skinIndex}-${position}`}
                    onClick={() => skinIndex !== null && setSelectedSkin(skinIndex)} 
                    className={`skin-minicard ${skinIndex === selectedSkin ? 'selected' : ''} ${skinIndex === null ? 'empty' : ''}`}
                    style={{
                      // El slot central (posición 2) debe ser más prominente si hay skin
                      transform: position === 2 && skinIndex !== null ? 'scale(1.1)' : 'scale(1)',
                      zIndex: position === 2 ? 10 : 5 - Math.abs(position - 2),
                      // Añadir transición suave
                      transition: 'all 0.3s ease-in-out',
                      // Si es un slot vacío, hacerlo semi-transparente
                      opacity: skinIndex === null ? 0.3 : 1,
                      cursor: skinIndex === null ? 'default' : 'pointer'
                    }}
                    role={skinIndex !== null ? "button" : undefined}
                    tabIndex={skinIndex !== null ? 0 : -1}
                    aria-label={skinIndex !== null ? `Skin ${skinIndex + 1} de ${champion.name}` : 'Slot vacío'}
                    onKeyDown={(e) => {
                      if (skinIndex !== null && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setSelectedSkin(skinIndex);
                      }
                    }}
                  >
                    {skinIndex !== null ? (
                      <>
                        <img
                          src={`/tiles/${champion.id}_${champion.skins[skinIndex].num}.jpg`}
                          className="skin-minicard-image"
                          alt={`Skin ${skinIndex + 1} de ${champion.name}`}
                        />
                        {!isThisSkinInCollection(skinIndex) ? <GiPadlock className={`locked-icon ${skinIndex === selectedSkin ? 'selected' : ''}`}/> : null}
                      </>
                    ) : (
                      <div className="empty-slot">
                        <span>—</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/*<button 
                className="arrow-icon" 
                onClick={goToNextSkin}
                aria-label="Skin siguiente"
                title="Skin siguiente (→)"
                disabled={totalSkins <= 1}
                style={{ opacity: totalSkins <= 1 ? 0.5 : 1 }}
              >
                →
              </button>*/}
            </div>
          </div>
        </div>
      </div>
    </>
  }

  const Habilidades = () => {
    const spellKeys = ['P', 'Q', 'W', 'E', 'R'];
    const [selectedSpell, setSelectedSpell] = useState(0)
    return (<div className="spells-section">
      <video
        src={`https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}/ability_0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}_${spellKeys[selectedSpell]}1.mp4`}
        autoPlay
        loop
        playsInline
      />
      <div className="spells-panel">
        <div className="sprites-container">
          <div className="passive-item">
            <img onClick={() => setSelectedSpell(0)} className={`passive-image ${selectedSpell === 0 ? 'selected' : null}`} src={`/passive/${champion.passive.image.full}`}></img>
            P
          </div>
          <div className="spell-separator"></div>
          {champion.spells.map((spell, index) => {
            return <div className="spell-item">
              <img onClick={() => setSelectedSpell(index+1)} className={`spell-image ${selectedSpell === index+1 ? 'selected' : null}`} src={`/spell/${spell.image.full}`}></img>
              {spellKeys[index]}
            </div>
          })}
          </div>
        <div className="spell-info">
          <h3 className="name"> {selectedSpell !== 0 ? champion.spells[selectedSpell -1].name : champion.passive.name} </h3>
          <p className="spell-description">{selectedSpell !== 0 ? champion.spells[selectedSpell -1].description : champion.passive.description}</p>
        </div>
      </div>

    </div>)
  }


  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div  className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.championInfo}>
            <div className={styles.championIcon}>
              <img 
                src={`/tiles/${champion.id}_0.jpg`} 
                alt={champion.name}
                className={styles.iconImage}
              />
            </div>
            <div className={styles.championText}>
              <h1 className={styles.championName}>{champion.name}</h1>
              <p className={styles.championTitle}>EL OJO DEL CREPÚSCULO</p>
            </div>
          </div>
          
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button className={styles.closeButton} onClick={onClose}>
            <IoClose  className="rounded-icon" />
          </button>
        </div>

        {activeTab === 'resumen' && <Resumen/>}
        {activeTab === 'aspectos' && <Aspectos/>}
        {activeTab === 'habilidades' && <Habilidades/>}
        
      </div>
    </div>
  );
};

export default ChampionDetailModal;

