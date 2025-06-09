import React, { useMemo, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';

// Componentes da Aplicação
import Header from './components/header/Header.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Componentes da Página Inicial (Pública)
import FullscreenImageSlider from './components/Slider/FullscreenImageSlider.jsx';
import GridSection from './components/grid/GridSection.jsx';
import LocationSection from './components/location/LocationSection.jsx';

// Páginas Públicas
import LoginPage from './assets/pages/login/LoginPage.jsx';
import ForgotPasswordPage from './assets/pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './assets/pages/auth/ResetPasswordPage.jsx';

// Páginas da Área Restrita (Protegidas)
import DashboardPage from './assets/pages/dashboard/DashboardPage.jsx';
import AvisosPage from './assets/pages/avisos/AvisosPage.jsx';

// Estilos e Imagens
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imgSlider1 from './assets/images/slider/slider1.jpg';
import imgSlider2 from './assets/images/slider/slider2.jpg';
import imgSlider3 from './assets/images/slider/slider3.jpg';
import imgSlider4 from './assets/images/slider/slider4.jpg';

// --- Componente para a Página Inicial ---
// Para manter o App.jsx limpo, a lógica da HomePage é isolada aqui.
const HomePage = ({ minhasImagens, cardData }) => {
  const location = useLocation();

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
      <section id="contato" aria-label="Entre em Contato" style={{ padding: '50px 0', minHeight: '300px' }}>
         <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <h2>Entre em Contato</h2>
          <p>Email: contato@exemplo.com | Telefone: (XX) XXXX-XXXX</p>
        </div>
      </section>
    </>
  );
};


// --- Componente Principal da Aplicação ---
function App() {
  // Memoização dos dados para evitar recriações desnecessárias em cada renderização
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

  return (
    <div className="App">
      <Header />
      <main className="app-main-content">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage minhasImagens={minhasImagens} cardData={cardData} />} />
          <Route path="/login-teste" element={<LoginPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/resetar-senha/:token" element={<ResetPasswordPage />} />
          
          {/* Rotas de conveniência para links de âncora */}
          <Route path="/sobre" element={<HomePage minhasImagens={minhasImagens} cardData={cardData} />} />
          <Route path="/contato" element={<HomePage minhasImagens={minhasImagens} cardData={cardData} />} />

          {/* Wrapper para Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/mural-de-avisos" element={<AvisosPage />} />
            {/* Futuras rotas protegidas serão adicionadas aqui */}
          </Route>

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>404 - Página Não Encontrada</h2>
              <p>Oops! A página que você está a procurar não existe.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
