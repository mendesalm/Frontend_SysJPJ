// GridSection.jsx
import React from 'react';
import './GridSection.css';

function GridSection({ cardContents }) { // Prop renomeada para cardContents

  // Função para criar um card padrão caso os dados não sejam fornecidos corretamente
  const createDefaultCardData = (index) => ({
    title: `Título Card ${index + 1}`,
    text: `Conteúdo padrão para o card ${index + 1}. Verifique os dados passados via props.`
  });

  // Processa os conteúdos dos cards, garantindo que tenhamos 3 cards
  // e que cada um tenha 'title' e 'text'.
  const processedContents = [];
  for (let i = 0; i < 3; i++) {
    if (cardContents && cardContents[i] && typeof cardContents[i].title === 'string' && typeof cardContents[i].text === 'string') {
      processedContents.push(cardContents[i]);
    } else {
      // Se o item específico não existir ou não tiver title/text, usa o padrão
      processedContents.push(createDefaultCardData(i));
    }
  }

  return (
    <section className="grid-section">
        <div className='grid-container'>    
            <div className="grid-row-1">
                <h2>Loja João Pedro Junqueira</h2>
                <p> A 50 anos fazendo melhores os homens bons!.</p>
            </div>
            <div className="grid-row-2">
                {processedContents.map((content, index) => (
                <div className="card" key={index}>
                    {/* Usando content.title para o título do card */}
                    <h3>{content.title}</h3>
                    {/* Usando content.text para o texto do card */}
                    <p>{content.text}</p>
                </div>
                ))}
            </div> 
        </div>'      
    </section>
  );
}

export default GridSection;