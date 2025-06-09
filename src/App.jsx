import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts e Componentes Estruturais
import Header from './components/header/Header.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Páginas
import HomePage from './assets/pages/home/HomePage.jsx';
import LoginPage from './assets/pages/login/LoginPage.jsx';
import ForgotPasswordPage from './assets/pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './assets/pages/auth/ResetPasswordPage.jsx';
import DashboardPage from './assets/pages/dashboard/DashboardPage.jsx';
import ProfilePage from './assets/pages/profile/ProfilePage.jsx';
import AvisosPage from './assets/pages/avisos/AvisosPage.jsx';
import MemberCreatePage from './assets/pages/admin/members/MemberCreatePage.jsx';
import EventosPage from './assets/pages/eventos/EventosPage.jsx';
import PublicacoesPage from './assets/pages/publicacoes/PublicacoesPage.jsx';
import BibliotecaPage from './assets/pages/biblioteca/BibliotecaPage.jsx';
import HarmoniaPage from './assets/pages/harmonia/HarmoniaPage.jsx';
import PlayerPage from './assets/pages/harmonia/PlayerPage.jsx';
import SessionsPage from './assets/pages/sessions/SessionsPage.jsx';
import ComissoesPage from './assets/pages/comissoes/ComissoesPage.jsx';
import PatrimonioPage from './assets/pages/patrimonio/PatrimonioPage.jsx';
import RelatoriosPage from './assets/pages/relatorios/RelatoriosPage.jsx';
import MemberList from './assets/pages/admin/members/MemberList.jsx';
import MemberEditPage from './assets/pages/admin/members/MemberEditPage.jsx';
import PlanoContasPage from './assets/pages/financeiro/PlanoContasPage.jsx';
import LancamentosPage from './assets/pages/financeiro/LancamentosPage.jsx';
import OrcamentoPage from './assets/pages/financeiro/OrcamentoPage.jsx';

function App() {
  return (
    <div className="App">
      {/* O Header só será visível nas rotas públicas */}
      <Routes>
        {/* Rotas Públicas com Header */}
        <Route path="/" element={<><Header /><HomePage /></>} />
        <Route path="/sobre" element={<><Header /><HomePage /></>} />
        <Route path="/contato" element={<><Header /><HomePage /></>} />
        
        {/* Rotas Públicas sem Header */}
        <Route path="/login-teste" element={<LoginPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/resetar-senha/:token" element={<ResetPasswordPage />} />
        
        {/* Rotas Protegidas dentro do novo Layout com Sidebar */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/mural-de-avisos" element={<AvisosPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/publicacoes" element={<PublicacoesPage />} />
            <Route path="/biblioteca" element={<BibliotecaPage />} />
            <Route path="/harmonia" element={<HarmoniaPage />} />
            <Route path="/player-harmonia" element={<PlayerPage />} />
            <Route path="/sessoes" element={<SessionsPage />} />
            <Route path="/comissoes" element={<ComissoesPage />} />
            <Route path="/patrimonio" element={<PatrimonioPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/admin/members" element={<MemberList />} />
            <Route path="/admin/members/create" element={<MemberCreatePage />} />
            <Route path="/admin/members/edit/:memberId" element={<MemberEditPage />} />
            <Route path="/financeiro/plano-contas" element={<PlanoContasPage />} />
            <Route path="/financeiro/lancamentos" element={<LancamentosPage />} />
            <Route path="/financeiro/orcamento" element={<OrcamentoPage />} />
          </Route>
        </Route>

        <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;
