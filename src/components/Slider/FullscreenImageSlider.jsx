// FullscreenImageSlider.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Slider from 'react-slick';

import './FullscreenImageSlider.css'; // Seus estilos customizados

// Lembre-se: "slick-carousel/slick/slick.css" e "slick-carousel/slick/slick-theme.css"
// devem ser importados uma única vez no seu App.jsx ou index.js.

const FullscreenImageSlider = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const autoplaySpeedSetting = 8000;
  const transitionSpeedSetting = 2000;

  // Memoiza dados para as barras de progresso
  const imagesForProgressBars = useMemo(() => {
    const actualImages = images || [];
    const placeholdersNeeded = Math.max(0, 4 - actualImages.length);
    const firstFourImages = actualImages.slice(0, 4).map(img => (typeof img === 'string' ? { src: img } : img));
    const placeholders = Array(placeholdersNeeded).fill(null).map((_, i) => ({
      src: `https://via.placeholder.com/100x50/808080/FFFFFF?text=Bar`,
      alt: `Placeholder ${actualImages.length + i + 1}`,
      isPlaceholder: true,
    }));
    return [...firstFourImages, ...placeholders].slice(0, 4);
  }, [images]);

  // Função para gerenciar animações do texto de sobreposição
  const manageTextOverlayAnimation = useCallback((slideIndex, animationClassName) => {
    console.log(`%cMANAGE TEXT: slideIndex=${slideIndex}, class=${animationClassName}, refPresent=${!!sliderRef.current?.innerSlider?.list}`,
                `color: ${animationClassName === 'animate-enter' ? 'green' : 'red'}; font-weight: bold;`);
    if (!sliderRef.current?.innerSlider?.list) {
      console.warn('  MANAGE TEXT: sliderRef.current.innerSlider.list não encontrado.');
      return;
    }
    const slideElements = sliderRef.current.innerSlider.list.querySelectorAll(`.slick-slide[data-index="${slideIndex}"]`);
    console.log(`  MANAGE TEXT: Encontrados ${slideElements.length} elementos de slide para data-index ${slideIndex}`);
    if (slideElements.length === 0) {
      console.warn(`  MANAGE TEXT: Nenhum .slick-slide com data-index="${slideIndex}" encontrado.`);
    }
    slideElements.forEach((slideElement, elIndex) => {
      const textOverlay = slideElement.querySelector('.slide-text-overlay');
      if (textOverlay) {
        const currentDataIndex = slideElement.getAttribute('data-index');
        console.log(`    Overlay ${elIndex} (data-index real: ${currentDataIndex}): Classes ANTES: "${textOverlay.className}"`);
        textOverlay.classList.remove('animate-enter', 'animate-exit');
        void textOverlay.offsetHeight; // Força reflow para reiniciar animação
        if (animationClassName) {
          textOverlay.classList.add(animationClassName);
          console.log(`    Overlay ${elIndex} (data-index real: ${currentDataIndex}): Classes DEPOIS de ADICIONAR '${animationClassName}': "${textOverlay.className}"`);
        } else {
          console.log(`    Overlay ${elIndex} (data-index real: ${currentDataIndex}): Classes DEPOIS de REMOVER: "${textOverlay.className}"`);
        }
      } else {
        console.warn(`    Overlay ${elIndex} para data-index ${slideIndex} (no .slick-slide com data-index real: ${slideElement.getAttribute('data-index')}): .slide-text-overlay NÃO ENCONTRADO.`);
      }
    });
  }, []); // Esta useCallback é estável

  // Callback ANTES da mudança de slide
  const handleBeforeChange = useCallback((oldIndex, newIndex) => {
    setCurrentSlide(newIndex);
    if (images && images[oldIndex] && images[oldIndex].overlayText) {
      manageTextOverlayAnimation(oldIndex, 'animate-exit');
    }
  }, [images, manageTextOverlayAnimation]);

  // Callback DEPOIS da mudança de slide
  const handleAfterChange = useCallback((currentIndex) => {
    const progressBarsInDOM = document.querySelectorAll('.fullscreen-slider-container .progress-bar-inner');
    const numPhysicalBars = progressBarsInDOM.length;
    if (numPhysicalBars > 0) {
      const activeBarDomIndex = currentIndex % numPhysicalBars;
      progressBarsInDOM.forEach((bar, barDomIndex) => {
        bar.style.animation = 'none';
        bar.style.width = '0%';
        if (barDomIndex === activeBarDomIndex) {
          void bar.offsetHeight;
          bar.style.animation = `progressBarAnimation ${autoplaySpeedSetting / 1000}s linear forwards`;
        }
      });
    }
    if (images && images[currentIndex] && images[currentIndex].overlayText) {
      manageTextOverlayAnimation(currentIndex, 'animate-enter');
    }
  }, [images, autoplaySpeedSetting, manageTextOverlayAnimation]);

  // Configurações do Slider
  const settings = useMemo(() => ({
    dots: false,
    infinite: true,
    speed: transitionSpeedSetting,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: autoplaySpeedSetting,
    fade: false,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    adaptiveHeight: false,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
    pauseOnHover: true,
    onInit: () => {
      console.log('%cSLIDER ONINIT: Iniciando animação para slide 0', 'color: blue; font-weight: bold;');
      // Garante que os textos comecem sem classes de animação (CSS base com opacity:0 os esconde)
      if (sliderRef.current?.innerSlider?.list) {
        const allTextOverlays = sliderRef.current.innerSlider.list.querySelectorAll('.slide-text-overlay');
        allTextOverlays.forEach(overlay => {
          overlay.classList.remove('animate-enter', 'animate-exit');
        });
      }
      // Aplica animação de entrada para o texto do primeiro slide.
      if (images && images.length > 0 && images[0] && images[0].overlayText) {
        manageTextOverlayAnimation(0, 'animate-enter');
      }
    }
  }), [
    images,
    autoplaySpeedSetting,
    transitionSpeedSetting,
    handleBeforeChange,
    handleAfterChange,
    manageTextOverlayAnimation
  ]);

  // useEffect para animação inicial da BARRA DE PROGRESSO do primeiro slide
  useEffect(() => {
    if (images && images.length > 0 && currentSlide === 0) {
      console.log('%cEFFECT[barra_progresso_inicial]: Animando barra para slide 0', 'color: purple');
      const allProgressBars = document.querySelectorAll('.fullscreen-slider-container .progress-bar-inner');
      if (allProgressBars.length > 0) {
        allProgressBars.forEach((bar) => {
          bar.style.animation = 'none';
          bar.style.width = '0%';
        });
        const firstProgressBar = allProgressBars[0];
        if (firstProgressBar) {
          firstProgressBar.style.animation = 'none';
          void firstProgressBar.offsetHeight;
          firstProgressBar.style.animation = `progressBarAnimation ${autoplaySpeedSetting / 1000}s linear forwards`;
        }
      }
    }
  }, [images, autoplaySpeedSetting, currentSlide]);

  // REMOVIDO: O useEffect que dependia apenas de [images] para resetar todos os textos.
  // A lógica de reset inicial agora está mais concentrada no onInit
  // e o CSS base garante o estado inicial de opacity: 0.

  if (!images || images.length === 0) {
    return <div className="fullscreen-slider-container error">Nenhuma imagem fornecida.</div>;
  }

  return (
    <div className="fullscreen-slider-container">
      <Slider ref={sliderRef} {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide">
            <img 
              src={typeof image === 'string' ? image : image.src} 
              alt={typeof image === 'string' ? `Slide ${index + 1}` : (image.alt || `Slide ${index + 1}`)} 
            />
            {typeof image !== 'string' && image.caption && (
              <div className="caption">{image.caption}</div>
            )}
            {typeof image !== 'string' && image.overlayText && (
              <div className="slide-text-overlay glassmorphism">
                <p>{image.overlayText}</p>
              </div>
            )}
          </div>
        ))}
      </Slider>
      <div className="progress-bars-container">
        {imagesForProgressBars.map((barData, index) => {
          const isActive = index === (currentSlide % imagesForProgressBars.length);
          return (
            <div
              key={index}
              className={`progress-bar ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (index < images.length && sliderRef.current && !barData.isPlaceholder) {
                    sliderRef.current.slickGoTo(index);
                }
              }}
              style={{ cursor: (index < images.length && !barData.isPlaceholder) ? 'pointer' : 'default' }}
            >
              <div className="progress-bar-inner"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FullscreenImageSlider;
