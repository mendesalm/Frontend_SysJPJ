import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Layouts e Componentes Estruturais (carregados imediatamente)
import Header from "./components/header/Header.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import NewDashboardLayout from "./components/layout/NewDashboardLayout.jsx";

// Páginas Públicas (podem ser lazy-loaded também, mas geralmente são pequenas)
import HomePage from "./assets/pages/home/HomePage.jsx";
import LoginPage from "./assets/pages/login/LoginPage.jsx";
import ForgotPasswordPage from "./assets/pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./assets/pages/auth/ResetPasswordPage.jsx";

// --- Início da Modificação: Lazy Loading das Páginas Protegidas ---

const DashboardPage = lazy(() =>
  import("./assets/pages/dashboard/DashboardPage.jsx")
);
const ProfilePage = lazy(() =>
  import("./assets/pages/profile/ProfilePage.jsx")
);
const AvisosPage = lazy(() => import("./assets/pages/avisos/AvisosPage.jsx"));
const EventosPage = lazy(() =>
  import("./assets/pages/eventos/EventosPage.jsx")
);
const PublicacoesPage = lazy(() =>
  import("./assets/pages/publicacoes/PublicacoesPage.jsx")
);
const BibliotecaPage = lazy(() =>
  import("./assets/pages/biblioteca/BibliotecaPage.jsx")
);
const HarmoniaPage = lazy(() =>
  import("./assets/pages/harmonia/HarmoniaPage.jsx")
);
const PlayerPage = lazy(() => import("./assets/pages/harmonia/PlayerPage.jsx"));
const SessionsPage = lazy(() =>
  import("./assets/pages/sessions/SessionsPage.jsx")
);
const ComissoesPage = lazy(() =>
  import("./assets/pages/comissoes/ComissoesPage.jsx")
);
const PatrimonioPage = lazy(() =>
  import("./assets/pages/patrimonio/PatrimonioPage.jsx")
);
const RelatoriosPage = lazy(() =>
  import("./assets/pages/relatorios/RelatoriosPage.jsx")
);
const PermissionsPage = lazy(() =>
  import("./assets/pages/admin/permissions/PermissionsPage.jsx")
);

// Páginas de Admin
const MemberList = lazy(() =>
  import("./assets/pages/admin/members/MemberList.jsx")
);
const MemberCreatePage = lazy(() =>
  import("./assets/pages/admin/members/MemberCreatePage.jsx")
);
const MemberEditPage = lazy(() =>
  import("./assets/pages/admin/members/MemberEditPage.jsx")
);

// Páginas Financeiras
const PlanoContasPage = lazy(() =>
  import("./assets/pages/financeiro/PlanoContasPage.jsx")
);
const LancamentosPage = lazy(() =>
  import("./assets/pages/financeiro/LancamentosPage.jsx")
);
const OrcamentoPage = lazy(() =>
  import("./assets/pages/financeiro/OrcamentoPage.jsx")
);

// --- Fim da Modificação ---

// Componente simples para o fallback do Suspense
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      color: "white",
      backgroundColor: "#111827",
    }}
  >
    <h2>Carregando...</h2>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="App">
        {/* O Suspense deve envolver as rotas que usam componentes lazy-loaded */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rotas Públicas com Header */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                </>
              }
            />
            {/* ... outras rotas públicas podem permanecer como estão se desejar */}

            {/* Rotas Públicas sem Header */}
            <Route path="/login-teste" element={<LoginPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route
              path="/resetar-senha/:token"
              element={<ResetPasswordPage />}
            />

            {/* Rotas Protegidas dentro do novo Layout com Sidebar */}
            <Route element={<ProtectedRoute />}>
              <Route element={<NewDashboardLayout />}>
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
                <Route
                  path="/admin/members/create"
                  element={<MemberCreatePage />}
                />
                <Route
                  path="/admin/members/edit/:memberId"
                  element={<MemberEditPage />}
                />
                <Route
                  path="/financeiro/plano-contas"
                  element={<PlanoContasPage />}
                />
                <Route
                  path="/financeiro/lancamentos"
                  element={<LancamentosPage />}
                />
                <Route
                  path="/financeiro/orcamento"
                  element={<OrcamentoPage />}
                />
                <Route
                  path="/admin/permissions"
                  element={<PermissionsPage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<h2>404 - Página Não Encontrada</h2>} />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
