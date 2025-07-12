import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <p>&copy; {new Date().getFullYear()} Loja Maçônica João Pedro Junqueira nº2181. Todos os direitos reservados.</p>
      <p>Desenvolvido por André Luiz Mendes</p>
    </footer>
  );
};

export default Footer;
