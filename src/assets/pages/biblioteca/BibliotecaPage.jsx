import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getLivros,
  createLivro,
  updateLivro,
  registrarEmprestimo,
  registrarDevolucao,
  reservarLivro,
} from "../../../services/bibliotecaService";
import Modal from "../../../components/modal/Modal";
import LivroForm from "./LivroForm";
import EmprestimoForm from "./EmprestimoForm";
import "../../styles/TableStyles.css";

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const BibliotecaPage = () => {
  const {
    data: livros,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getLivros);

  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [actionError, setActionError] = useState('');

  const { user } = useAuth();

  const [isLivroModalOpen, setIsLivroModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [currentLivro, setCurrentLivro] = useState(null);

  const canManageLibrary =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveLivro = async (formData) => {
    try {
      const isUpdating = !!(currentLivro && currentLivro.id);
      if (isUpdating) {
        await updateLivro(currentLivro.id, formData);
      } else {
        await createLivro(formData);
      }
      refetch();
      setIsLivroModalOpen(false);
      // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast(
        `Livro ${isUpdating ? "atualizado" : "adicionado"} com sucesso!`
      );
    } catch (err) {
      console.error("Erro ao salvar o livro:", err);
      // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      showErrorToast(err.response?.data?.message || "Erro ao salvar o livro.");
    }
  };

  const handleRegistrarEmprestimo = async (emprestimoData) => {
    try {
      await registrarEmprestimo(emprestimoData);
      refetch();
      setIsEmprestimoModalOpen(false);
      // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      showSuccessToast("Empréstimo registrado com sucesso!");
    } catch (err) {
      console.error("Erro ao registar empréstimo:", err);
      // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
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
      // O alert aqui é aceitável pois é um erro de lógica/validação, não de API.
      alert(
        "Erro: Não foi possível encontrar um empréstimo ativo para este livro."
      );
      return;
    }
    if (window.confirm(`Confirma a devolução do livro "${livro.titulo}"?`)) {
      try {
        await registrarDevolucao(emprestimoAtivo.id);
        refetch();
        // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
        showSuccessToast("Devolução registrada com sucesso!");
      } catch (err) {
        console.error("Erro ao registar devolução:", err);
        // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
        showErrorToast(
          err.response?.data?.message || "Erro ao registar a devolução."
        );
      }
    }
  };

  const handleReservarLivro = async (livroId) => {
    if (window.confirm("Deseja entrar na fila de reserva para este livro?")) {
      try {
        await reservarLivro(livroId);
        refetch();
        // 3. SUBSTITUÍMOS O alert() PELA NOTIFICAÇÃO DE SUCESSO
        showSuccessToast("Reserva realizada com sucesso!");
      } catch (err) {
        console.error("Erro ao realizar reserva:", err);
        // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
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
    return <div className="table-page-container">A carregar acervo...</div>;

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Acervo da Biblioteca</h1>
        {canManageLibrary && (
          <button onClick={openCreateModal} className="btn-action btn-approve">
            + Adicionar Livro
          </button>
        )}
      </div>

      {/* 5. A EXIBIÇÃO DE ERRO DE AÇÃO FOI REMOVIDA DAQUI */}
      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor(es)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && livros.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhum livro cadastrado no acervo.
                </td>
              </tr>
            ) : (
              livros.map((livro) => (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autores}</td>
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
                  <td className="actions-cell">
                    {livro.status === "Disponível" && canManageLibrary && (
                      <button
                        onClick={() => openEmprestimoModal(livro)}
                        className="btn-action btn-edit"
                      >
                        Emprestar
                      </button>
                    )}
                    {livro.status === "Emprestado" && canManageLibrary && (
                      <button
                        onClick={() => handleRegistrarDevolucao(livro)}
                        className="btn-action"
                        style={{ backgroundColor: "#ca8a04", color: "#1f2937" }}
                      >
                        Devolver
                      </button>
                    )}
                    {livro.status === "Emprestado" && !canManageLibrary && (
                      <button
                        onClick={() => handleReservarLivro(livro.id)}
                        className="btn-action"
                      >
                        Reservar
                      </button>
                    )}
                    {canManageLibrary && (
                      <button
                        onClick={() => openEditModal(livro)}
                        className="btn-action"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
