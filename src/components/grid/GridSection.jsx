// GridSection.jsx
import React from "react";
import "./GridSection.css";

// NOVO: Definição dos componentes SVG para os ícones
const MissaoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="card-icon"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const VisaoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="card-icon"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ValoresIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="card-icon"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

function GridSection({ cardTexts }) {
  // Função para criar um card padrão caso os dados não sejam fornecidos corretamente
  const createDefaultCardData = (index) => ({
    title: `Título Card ${index + 1}`,
    text: `Conteúdo padrão para o card ${index + 1}.`,
    image: `https://placehold.co/100x100/cccccc/333333?text=Icon${index + 1}`,
  });

  // Processa os conteúdos dos cards, agora para 4 cards
  const processedContents = [];
  for (let i = 0; i < 4; i++) {
    if (cardTexts && cardTexts[i]) {
      processedContents.push(cardTexts[i]);
    } else {
      processedContents.push(createDefaultCardData(i));
    }
  }

  // NOVO: Mapeamento de títulos para os componentes de ícones SVG
  const iconMap = {
    "Nossa Missão": <MissaoIcon />,
    "Nossa Visão": <VisaoIcon />,
    "Nossos Valores": <ValoresIcon />,
  };

  return (
    <section className="grid-section">
      <div className="grid-container">
        <div className="grid-row-1">
          <h2>Loja João Pedro Junqueira</h2>
          <p> A 43 anos tornando melhores os Homens de Bem!</p>
        </div>

        <div className="grid-row-2">
          {processedContents.slice(0, 3).map((content, index) => (
            <div className="card" key={index}>
              {/* ATUALIZADO: Renderiza o ícone SVG correspondente ao título */}
              {iconMap[content.title]}
              <h3>{content.title}</h3>
              {content.content ? content.content : <p>{content.text}</p>}
            </div>
          ))}
        </div>

        <div className="grid-row-3">
          {processedContents[3] && (
            // Adiciona a classe card-horizontal para o layout especial
            <div className="card card-horizontal">
              {/* Mantém a lógica da imagem para o quarto card */}
              {processedContents[3].image && (
                <img
                  src={processedContents[3].image}
                  alt={processedContents[3].title}
                  className="card-image-left"
                />
              )}
              <div className="card-content">
                <h3>{processedContents[3].title}</h3>
                {processedContents[3].content ? (
                  processedContents[3].content
                ) : (
                  <p>{processedContents[3].text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GridSection;
