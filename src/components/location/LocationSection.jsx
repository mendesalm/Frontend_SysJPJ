import React from 'react';
import './LocationSection.css'; 

const LocationSection = () => {
  return (
    <section id="localizacao">
      <div className="location-content-wrapper">
        <h2>Nossa Localização</h2>
        <p className="location-description">
          Encontre a Loja Maçônica João Pedro Junqueira no endereço abaixo.
          Esperamos por você!
        </p>
        <div className="map-responsive">
          {/* CORREÇÃO: A URL do 'src' do iframe foi substituída por uma versão mais limpa e estável
            para evitar erros de script do Google Maps.
          */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3823.66986509618!2d-48.9566906!3d-16.2887163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ea47ba4084585%3A0x9ef6a3c653ccb834!2sLoja%20Ma%C3%A7%C3%B4nica%20Jo%C3%A3o%20Pedro%20Junqueira!5e0!3m2!1spt-BR!2sbr"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Loja Maçônica João Pedro Junqueira"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;