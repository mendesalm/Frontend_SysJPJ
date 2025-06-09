import React, { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Importe os componentes utilizados na HomePage
import FullscreenImageSlider from '../../../components/Slider/FullscreenImageSlider.jsx';
import GridSection from '../../../components/grid/GridSection.jsx';
import LocationSection from '../../../components/location/LocationSection.jsx';

// Importe as imagens
import imgSlider1 from '../../images/slider/slider1.jpg';
import imgSlider2 from '../../images/slider/slider2.jpg';
import imgSlider3 from '../../images/slider/slider3.jpg';
import imgSlider4 from '../../images/slider/slider4.jpg';

const HomePage = () => {
  const location = useLocation();

  // Memoize os dados para evitar recriações desnecessárias
  const minhasImagens = useMemo(() => [
    { src: imgSlider1, alt: 'Imagem 1' },
    { src: imgSlider2, alt: 'Imagem 2' },
    { src: imgSlider3, alt: 'Imagem 3' },
    { src: imgSlider4, alt: 'Imagem 4' },
  ], []);

  const cardData = useMemo(() => [
    { title: "Soluções Completas", text: "Oferecemos uma gama completa de serviços." },
    { title: "Inovação Contínua", text: "Estamos sempre buscando as últimas tecnologias." },
    { title: "Suporte Dedicado", text: "Nossa equipe está pronta para ajudar você." }
  ], []);

  // Efeito para lidar com a rolagem suave para âncoras (#)
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <section id="inicio" aria-label="Início - Slider de Imagens">
        <FullscreenImageSlider images={minhasImagens} />
      </section>
      <section id="sobre-nos" aria-label="Sobre Nós">
        <GridSection cardTexts={cardData} />
      </section>
      <section id="localizacao" aria-label="Nossa Localização">
        <LocationSection />
      </section>
      <section id="contato" aria-label="Entre em Contato" style={{ padding: '50px 0', minHeight: '300px', textAlign: 'center' }}>
         <div>
          <h2>Entre em Contato</h2>
          <p>Email: contato@exemplo.com | Telefone: (XX) XXXX-XXXX</p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
