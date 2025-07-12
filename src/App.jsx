import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
// Layouts e Componentes Estruturais
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
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
const LegislacoesPage = lazy(() =>
  import("./assets/pages/admin/files/GenericFileManagementPage.jsx").then(
    (module) => ({ default: module.LegislacoesPage })
  )
);
const DocumentosPage = lazy(() =>
  import("./assets/pages/admin/files/GenericFileManagementPage.jsx").then(
    (module) => ({ default: module.DocumentosPage })
  )
);
const ArquivosPage = lazy(() =>
  import("./assets/pages/admin/files/GenericFileManagementPage.jsx").then(
    (module) => ({ default: module.ArquivosPage })
  )
);
const ClassificadosPage = lazy(() =>
  import("./assets/pages/classificados/ClassificadosPage.jsx")
);
const LocacaoSalaoPage = lazy(() =>
  import("./assets/pages/locacoes/LocacaoSalaoPage.jsx")
);
const GeracaoCartoesPage = lazy(() =>
  import("./assets/pages/chancelaria/GeracaoCartoesPage.jsx")
);

const DocumentosGeradosList = lazy(() =>
  import("./assets/pages/documentos/DocumentosGeradosList.jsx")
);
const CreateDocumentoGerado = lazy(() =>
  import("./assets/pages/documentos/CreateDocumentoGerado.jsx")
);
const ViewDocumentoGerado = lazy(() =>
  import("./assets/pages/documentos/ViewDocumentoGerado.jsx")
);

const BalaustreSettingsPage = lazy(() =>
  import("./assets/pages/admin/balaustre-settings/BalaustreSettings.jsx")
);
const GestaoSolicitacoesPage = lazy(() =>
  import("./assets/pages/biblioteca/GestaoSolicitacoesPage.jsx")
);
const ChanceryReportsPage = lazy(() =>
  import("./assets/pages/chancelaria/ChanceryReportsPage.jsx")
);
const GestaoLojasPage = lazy(() =>
  import("./assets/pages/admin/lojas/GestaoLojasPage.jsx")
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
            <Route
              path="/login"
              element={
                <>
                  <Header />
                  <LoginPage />
                </>
              }
            />

            <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
            <Route
              path="/resetar-senha/:token"
              element={
                <>
                  <Header />
                  <ResetPasswordPage />
                  <Footer />
                </>
              }
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
                  path="/admin/balaustre-settings"
                  element={<BalaustreSettingsPage />}
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
                <Route path="/admin/lojas" element={<GestaoLojasPage />} />
                <Route
                  path="/admin/biblioteca/solicitacoes"
                  element={<GestaoSolicitacoesPage />}
                />
                <Route
                  path="/chanceler/relatorios"
                  element={<ChanceryReportsPage />}
                />

                <Route
                  path="/minhas-visitacoes"
                  element={<MinhasVisitasPage />}
                />
                <Route
                  path="/admin/escala-jantares"
                  element={<GestaoEscalaPage />}
                />
                <Route path="/classificados" element={<ClassificadosPage />} />
                <Route path="/locacao-salao" element={<LocacaoSalaoPage />} />
                <Route
                  path="/chancelaria/gerar-cartoes"
                  element={<GeracaoCartoesPage />}
                />

                <Route path="/sessoes/:id" element={<SessaoDetalhesPage />} />
                <Route path="/legislacoes" element={<LegislacoesPage />} />
                <Route path="/documentos" element={<DocumentosPage />} />
                <Route
                  path="/documentos-gerados"
                  element={<DocumentosGeradosList />}
                />
                <Route
                  path="/documentos-gerados/novo"
                  element={<CreateDocumentoGerado />}
                />
                <Route
                  path="/documentos-gerados/:id"
                  element={<ViewDocumentoGerado />}
                />

                <Route path="/arquivos-diversos" element={<ArquivosPage />} />
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
