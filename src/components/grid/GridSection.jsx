// GridSection.jsx
import React from "react";
import { Link } from "react-router-dom"; // Importa o Link para o botão
import "./GridSection.css";

function GridSection({ cardTexts }) {
  // Função para criar um card padrão caso os dados não sejam fornecidos corretamente
  const createDefaultCardData = (index) => ({
    title: `Título Card ${index + 1}`,
    text: `Conteúdo padrão para o card ${
      index + 1
    }. Verifique os dados passados via props.`,
  });

  // Processa os conteúdos dos cards
  const processedContents = [];
  for (let i = 0; i < 3; i++) {
    if (cardTexts && cardTexts[i]) {
      processedContents.push(cardTexts[i]);
    } else {
      processedContents.push(createDefaultCardData(i));
    }
  }

  return (
    <section className="grid-section">
      <div className="grid-container">
        <div className="grid-row-1">
          <h2>Loja João Pedro Junqueira</h2>
          <p> A 50 anos fazendo melhores os homens bons!.</p>
        </div>
        <div className="grid-row-2">
          {processedContents.map((content, index) => (
            <div className="card" key={index}>
              <h3>{content.title}</h3>
              {content.content ? content.content : <p>{content.text}</p>}
            </div>
          ))}
        </div>
        {/* NOVO: Terceira linha adicionada */}
        <div className="grid-row-3">
          <h2>Faça Parte da Nossa História</h2>
          <Link to="/#contato" className="cta-button">
            Entre em Contato
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GridSection;
