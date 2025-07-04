import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getLivros,
  createLivro,
  updateLivro,
  deleteLivro,
  registrarEmprestimo,
  registrarDevolucao,
  reservarLivro,
  solicitarEmprestimo, // Importa a nova função
} from "../../../services/bibliotecaService.js";
import Modal from "../../../components/modal/Modal";
import LivroForm from "./LivroForm";
import EmprestimoForm from "./EmprestimoForm";
import "../../styles/TableStyles.css";
import "./BibliotecaPage.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";
import apiClient from "../../../services/apiClient";

// Card de Detalhes atualizado para o novo fluxo
const LivroDetalhesCard = ({
  livro,
  canManageLibrary,
  user, // Recebe o objeto do utilizador para verificar solicitações
  onEmprestar,
  onDevolver,
  onEditar,
  onDeletar,
  onReservar,
  onSolicitar, // Nova prop para a função de solicitar
}) => {
  if (!livro) {
    return (
      <div className="livro-detalhes-card placeholder">
        <p>
          Passe o mouse sobre um livro na tabela para ver os detalhes e as
          ações.
        </p>
      </div>
    );
  }

  // Verifica se o próprio utilizador já tem uma solicitação para este livro
  const minhaSolicitacaoPendente = livro.historicoEmprestimos?.find(
    (e) => e.membroId === user.id && e.status === "solicitado"
  );

  const getCapaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) {
      return path;
    }
    const baseURL = apiClient.defaults.baseURL.startsWith("http")
      ? apiClient.defaults.baseURL
      : window.location.origin;
    return `${baseURL}/${path}`.replace("/api/", "/");
  };

  const capaUrl = getCapaUrl(livro.capaUrl);

  return (
    <div className="livro-detalhes-card">
      <div className="card-content">
        {capaUrl && (
          <img
            src={capaUrl}
            alt={`Capa de ${livro.titulo}`}
            className="livro-capa"
          />
        )}
        <h3>{livro.titulo}</h3>
        <p>
          <strong>Autor(es):</strong> {livro.autores || "Não informado"}
        </p>
        <p>
          <strong>Classificação:</strong>{" "}
          {livro.classificacao || "Não informada"}
        </p>
        <p className="livro-descricao">
          {livro.descricao || "Nenhuma descrição disponível."}
        </p>
      </div>
      <div className="card-actions">
        {/* Lógica de botões atualizada */}
        {livro.status === "Disponível" &&
          !canManageLibrary &&
          !minhaSolicitacaoPendente && (
            <button
              onClick={() => onSolicitar(livro.id)}
              className="btn-action btn-solicitar"
            >
              Solicitar Empréstimo
            </button>
          )}
        {minhaSolicitacaoPendente && (
          <p className="solicitacao-status-text">
            Sua solicitação para este livro está pendente.
          </p>
        )}
        {livro.status === "Disponível" && canManageLibrary && (
          <button
            onClick={() => onEmprestar(livro)}
            className="btn-action btn-approve"
          >
            Emprestar
          </button>
        )}
        {livro.status === "Emprestado" && canManageLibrary && (
          <button
            onClick={() => onDevolver(livro)}
            className="btn-action btn-devolver"
          >
            Devolver
          </button>
        )}
        {livro.status === "Emprestado" && !canManageLibrary && (
          <button
            onClick={() => onReservar(livro.id)}
            className="btn-action btn-reservar"
          >
            Reservar
          </button>
        )}
        {canManageLibrary && (
          <>
            <button
              onClick={() => onEditar(livro)}
              className="btn-action btn-edit"
            >
              Editar
            </button>
            <button
              onClick={() => onDeletar(livro.id, livro.titulo)}
              className="btn-action btn-delete"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const BibliotecaPage = () => {
  const {
    data: livros,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getLivros);
  const [hoveredLivro, setHoveredLivro] = useState(null);
  const { user } = useAuth();
  const [isLivroModalOpen, setIsLivroModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [currentLivro, setCurrentLivro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const livrosComCapaUrl = useMemo(() => {
    if (!livros) return [];
    return livros.map((livro) => ({ ...livro, capaUrl: livro.path }));
  }, [livros]);

  const livrosFiltrados = useMemo(() => {
    if (!searchTerm) return livrosComCapaUrl;
    return livrosComCapaUrl.filter(
      (livro) =>
        livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.autores.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (livro.classificacao &&
          livro.classificacao.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [livrosComCapaUrl, searchTerm]);

  const canManageLibrary =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  // Nova função para lidar com a solicitação
  const handleSolicitarEmprestimo = async (livroId) => {
    try {
      await solicitarEmprestimo(livroId);
      showSuccessToast("Solicitação enviada com sucesso! Aguarde a aprovação.");
      refetch(); // Atualiza os dados para refletir o novo estado de solicitação
    } catch (err) {
      showErrorToast(
        err.response?.data?.message ||
          "Não foi possível solicitar o empréstimo."
      );
    }
  };

  const handleSaveLivro = async (dataToSave) => {
    const formData = new FormData();
    Object.keys(dataToSave).forEach((key) => {
      if (key === "capa" && dataToSave.capa && dataToSave.capa[0]) {
        formData.append("capa", dataToSave.capa[0]);
      } else if (dataToSave[key] != null) {
        formData.append(key, dataToSave[key]);
      }
    });
    try {
      const isUpdating = !!(currentLivro && currentLivro.id);
      if (isUpdating) {
        await updateLivro(currentLivro.id, formData);
      } else {
        await createLivro(formData);
      }
      refetch();
      setIsLivroModalOpen(false);
      showSuccessToast(
        `Livro ${isUpdating ? "atualizado" : "adicionado"} com sucesso!`
      );
    } catch (err) {
      console.error("Erro ao salvar o livro:", err);
      showErrorToast(err.response?.data?.message || "Erro ao salvar o livro.");
    }
  };

  const handleRegistrarEmprestimo = async (emprestimoData) => {
    try {
      await registrarEmprestimo(emprestimoData);
      refetch();
      setIsEmprestimoModalOpen(false);
      showSuccessToast("Empréstimo registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao registar empréstimo:", err);
      showErrorToast(
        err.response?.data?.message || "Erro ao registar o empréstimo."
      );
    }
  };

  const handleRegistrarDevolucao = async (livro) => {
    const emprestimoAtivo = livro.historicoEmprestimos?.find(
      (e) => e.dataDevolucaoReal === null
    );
    if (!emprestimoAtivo) {
      alert(
        "Erro: Não foi possível encontrar um empréstimo ativo para este livro."
      );
      return;
    }
    if (window.confirm(`Confirma a devolução do livro "${livro.titulo}"?`)) {
      try {
        await registrarDevolucao(emprestimoAtivo.id);
        refetch();
        showSuccessToast("Devolução registrada com sucesso!");
        setHoveredLivro(null);
      } catch (err) {
        console.error("Erro ao registar devolução:", err);
        showErrorToast(
          err.response?.data?.message || "Erro ao registar a devolução."
        );
      }
    }
  };

  const handleDeleteLivro = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o livro "${titulo}"?`)) {
      try {
        await deleteLivro(id);
        refetch();
        showSuccessToast("Livro excluído com sucesso!");
        setHoveredLivro(null);
      } catch (err) {
        console.error("Erro ao excluir livro:", err);
        showErrorToast(
          err.response?.data?.message || "Erro ao excluir o livro."
        );
      }
    }
  };

  const handleReservarLivro = async (livroId) => {
    if (window.confirm("Deseja entrar na fila de reserva para este livro?")) {
      try {
        await reservarLivro(livroId);
        refetch();
        showSuccessToast("Reserva realizada com sucesso!");
      } catch (err) {
        console.error("Erro ao realizar reserva:", err);
        showErrorToast(
          err.response?.data?.message || "Não foi possível realizar a reserva."
        );
      }
    }
  };

  const openCreateModal = () => {
    setCurrentLivro(null);
    setIsLivroModalOpen(true);
  };
  const openEditModal = (livro) => {
    setCurrentLivro(livro);
    setIsLivroModalOpen(true);
  };
  const openEmprestimoModal = (livro) => {
    setCurrentLivro(livro);
    setIsEmprestimoModalOpen(true);
  };

  if (isLoading)
    return <div className="page-container">A carregar acervo...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Acervo da Biblioteca</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Buscar por título, autor..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {canManageLibrary && (
            <button
              onClick={openCreateModal}
              className="btn-action btn-approve"
            >
              + Adicionar Livro
            </button>
          )}
        </div>
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <main className="biblioteca-main-content">
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor(es)</th>
                  <th>Classificação</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && livrosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      {searchTerm
                        ? "Nenhum livro encontrado para a sua busca."
                        : "Nenhum livro cadastrado no acervo."}
                    </td>
                  </tr>
                ) : (
                  livrosFiltrados.map((livro) => (
                    <tr
                      key={livro.id}
                      onMouseEnter={() => setHoveredLivro(livro)}
                      onFocus={() => setHoveredLivro(livro)}
                      onClick={() => setHoveredLivro(livro)}
                    >
                      <td>{livro.titulo}</td>
                      <td>{livro.autores}</td>
                      <td>{livro.classificacao || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge status-${
                            livro.status?.toLowerCase().replace(/ /g, "-") ||
                            "disponível"
                          }`}
                        >
                          {livro.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="detalhes-sidebar">
          <LivroDetalhesCard
            livro={hoveredLivro}
            canManageLibrary={canManageLibrary}
            user={user}
            onEmprestar={openEmprestimoModal}
            onDevolver={handleRegistrarDevolucao}
            onEditar={openEditModal}
            onDeletar={handleDeleteLivro}
            onReservar={handleReservarLivro}
            onSolicitar={handleSolicitarEmprestimo}
          />
        </aside>
      </main>

      <Modal
        isOpen={isLivroModalOpen}
        onClose={() => setIsLivroModalOpen(false)}
        title={currentLivro ? "Editar Livro" : "Adicionar Novo Livro"}
      >
        <LivroForm
          livroToEdit={currentLivro}
          onSave={handleSaveLivro}
          onCancel={() => setIsLivroModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isEmprestimoModalOpen}
        onClose={() => setIsEmprestimoModalOpen(false)}
        title="Registar Empréstimo"
      >
        {currentLivro && (
          <EmprestimoForm
            livro={currentLivro}
            onSave={handleRegistrarEmprestimo}
            onCancel={() => setIsEmprestimoModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BibliotecaPage;
