import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importe o nosso hook!
import './Header.css';
import logoImagem from '../../assets/images/logo_jpg.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  
  // Use o nosso contexto de autenticação
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Efeito para o estilo do header ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Fecha o menu ao fazer logout
    navigate('/'); // Redireciona para a página inicial
  };
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    // Adicione a classe 'scrolled' dinamicamente
    <header className={`app-header ${isHeaderScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <Link to="/" onClick={closeMenu} className="header-logo-link">
          <img src={logoImagem} alt="Logo da Loja" className="header-logo" />
        </Link>
        <h1 className="header-title">Loja João Pedro Junqueira nº 2181</h1>

        <button
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/#inicio" onClick={closeMenu}>Início</Link></li>
            <li><Link to="/#sobre-nos" onClick={closeMenu}>Sobre Nós</Link></li>
            <li><Link to="/#localizacao" onClick={closeMenu}>Localização</Link></li>
            <li><Link to="/#contato" onClick={closeMenu}>Contato</Link></li>

            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard" onClick={closeMenu}>Área Restrita</Link></li>
                <li>
                  <a href="#!" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    Logout ({user?.NomeCompleto.split(' ')[0]})
                  </a>
                </li>
              </>
            ) : (
              <li><Link to="/login-teste" onClick={closeMenu}>Login</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
