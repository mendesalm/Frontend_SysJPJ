import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts e Componentes Estruturais
import Header from "./components/header/Header.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import NewDashboardLayout from "./components/layout/NewDashboardLayout.jsx";

// Páginas Públicas
import HomePage from "./assets/pages/home/HomePage.jsx";
import LoginPage from "./assets/pages/login/LoginPage.jsx";
import ForgotPasswordPage from "./assets/pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./assets/pages/auth/ResetPasswordPage.jsx";

// Lazy-loaded Pages
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
const MemberList = lazy(() =>
  import("./assets/pages/admin/members/MemberList.jsx")
);
const MemberCreatePage = lazy(() =>
  import("./assets/pages/admin/members/MemberCreatePage.jsx")
);
const MemberEditPage = lazy(() =>
  import("./assets/pages/admin/members/MemberEditPage.jsx")
);
const PlanoContasPage = lazy(() =>
  import("./assets/pages/financeiro/PlanoContasPage.jsx")
);
const LancamentosPage = lazy(() =>
  import("./assets/pages/financeiro/LancamentosPage.jsx")
);
const OrcamentoPage = lazy(() =>
  import("./assets/pages/financeiro/OrcamentoPage.jsx")
);
const GestaoPlaylistsPage = lazy(() =>
  import("./assets/pages/harmonia/GestaoPlaylistsPage.jsx")
);
const GestaoMusicasPage = lazy(() =>
  import("./assets/pages/harmonia/GestaoMusicasPage.jsx")
);
const MontagemSequenciaPage = lazy(() =>
  import("./assets/pages/harmonia/MontagemSequenciaPage.jsx")
);
const PlayerHarmoniaPage = lazy(() =>
  import("./assets/pages/harmonia/PlayerHarmoniaPage.jsx")
);
const GestaoVisitacoesPage = lazy(() =>
  import("./assets/pages/visitacoes/GestaoVisitacoesPage.jsx")
);
const MinhasVisitasPage = lazy(() =>
  import("./assets/pages/visitacoes/MinhasVisitasPage.jsx")
);
const GestaoEscalaPage = lazy(() =>
  import("./assets/pages/admin/escala/GestaoEscalaPage.jsx")
);
const SessaoDetalhesPage = lazy(() =>
  import("./assets/pages/sessions/details/SessaoDetalhesPage.jsx")
);

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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rotas Públicas */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <HomePage />
                </>
              }
            />
            <Route path="/login-teste" element={<LoginPage />} />
            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route
              path="/resetar-senha/:token"
              element={<ResetPasswordPage />}
            />

            {/* Rotas Protegidas com Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<NewDashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/mural-de-avisos" element={<AvisosPage />} />
                <Route path="/eventos" element={<EventosPage />} />
                <Route path="/publicacoes" element={<PublicacoesPage />} />
                <Route path="/biblioteca" element={<BibliotecaPage />} />
                <Route path="/sessoes" element={<SessionsPage />} />
                <Route path="/comissoes" element={<ComissoesPage />} />
                <Route path="/patrimonio" element={<PatrimonioPage />} />
                <Route path="/relatorios" element={<RelatoriosPage />} />
                <Route path="/admin/members" element={<MemberList />} />

                {/* ATUALIZAÇÃO: Rota antiga para editar balaústre foi removida */}

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
                <Route
                  path="/player-harmonia"
                  element={<PlayerHarmoniaPage />}
                />
                <Route
                  path="admin/harmonia/sequencias"
                  element={<MontagemSequenciaPage />}
                />
                <Route
                  path="admin/harmonia/playlists"
                  element={<GestaoPlaylistsPage />}
                />
                <Route
                  path="admin/harmonia/musicas"
                  element={<GestaoMusicasPage />}
                />
                <Route
                  path="/admin/visitacoes"
                  element={<GestaoVisitacoesPage />}
                />
                <Route
                  path="/minhas-visitacoes"
                  element={<MinhasVisitasPage />}
                />
                <Route
                  path="/admin/escala-jantares"
                  element={<GestaoEscalaPage />}
                />
                {/* ATUALIZAÇÃO: Nova rota para a página de detalhes da sessão */}
                <Route path="/sessoes/:id" element={<SessaoDetalhesPage />} />

                <Route
                  path="*"
                  element={
                    <h2>404 - Página Não Encontrada Dentro do Sistema</h2>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
