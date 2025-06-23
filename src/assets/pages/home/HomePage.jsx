import React, { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Importe os componentes utilizados na HomePage
import FullscreenImageSlider from "../../../components/Slider/FullscreenImageSlider.jsx";
import GridSection from "../../../components/grid/GridSection.jsx";
import LocationSection from "../../../components/location/LocationSection.jsx";

// Importe as imagens
import imgSlider1 from "../../images/slider/slider1.jpg";
import imgSlider2 from "../../images/slider/slider2.jpg";
import imgSlider3 from "../../images/slider/slider3.jpg";
import imgSlider4 from "../../images/slider/slider4.jpg";

const HomePage = () => {
  const location = useLocation();

  // Memoize os dados para evitar recriações desnecessárias
  const minhasImagens = useMemo(
    () => [
      { src: imgSlider1, alt: "Imagem 1" },
      { src: imgSlider2, alt: "Imagem 2" },
      { src: imgSlider3, alt: "Imagem 3" },
      { src: imgSlider4, alt: "Imagem 4" },
    ],
    []
  );

  const cardData = useMemo(
    () => [
      {
        title: "Nossa Missão",
        text: "Promover o aperfeiçoamento constante de nossos membros, transformando homens bons em homens ainda melhores, e atuar como uma força positiva para o progresso moral, social e intelectual da comunidade de Anápolis, sempre pautados pelos princípios da Fraternidade e da Justiça.",
      },
      {
        title: "Visão",
        text: "Ser reconhecida em Anápolis e região como uma Oficina de referência na formação de líderes éticos e cidadãos exemplares, cujo trabalho incansável e ações filantrópicas contribuam ativamente para a construção de uma sociedade mais justa, harmônica e esclarecida para as futuras gerações.",
      },
      {
        title: "Valores",
        // CORREÇÃO: O texto foi substituído por um elemento JSX para renderizar a lista HTML
        content: (
          <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
            <li>
              <strong>Fraternidade:</strong> Cultivar laços de união, lealdade e
              apoio mútuo entre os Irmãos.
            </li>
            <li>
              <strong>Conhecimento:</strong> Buscar incessantemente a verdade, a
              sabedoria e o desenvolvimento intelectual.
            </li>
            <li>
              <strong>Retidão:</strong> Agir com integridade, honra e justiça em
              todas as nossas ações.
            </li>
            <li>
              <strong>Filantropia:</strong> Praticar a caridade e o serviço
              desinteressado, visando o bem-estar da comunidade.
            </li>
            <li>
              <strong>Tolerância:</strong> Respeitar a diversidade de opiniões,
              crenças e origens, promovendo a paz e a harmonia.
            </li>
          </ul>
        ),
      },
    ],
    []
  );

  // Efeito para lidar com a rolagem suave para âncoras (#)
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
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
        {/* CORREÇÃO: A prop foi renomeada para 'cardTexts' para corresponder ao esperado pelo componente GridSection */}
        <GridSection cardTexts={cardData} />
      </section>
      <section id="localizacao" aria-label="Nossa Localização">
        <LocationSection />
      </section>
      <section
        id="contato"
        aria-label="Entre em Contato"
        style={{ padding: "50px 0", minHeight: "300px", textAlign: "center" }}
      >
        <div>
          <h2>Entre em Contato</h2>
          <p>Email: contato@exemplo.com | Telefone: (XX) XXXX-XXXX</p>
        </div>
      </section>
    </>
  );
};

export default HomePage;
