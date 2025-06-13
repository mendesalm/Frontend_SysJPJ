import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
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

const BibliotecaPage = () => {
  // 2. Lógica de busca de dados centralizada no hook
  const {
    data: livros,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getLivros);

  const [actionError, setActionError] = useState(""); // Erro para ações do usuário
  const { user } = useAuth();

  const [isLivroModalOpen, setIsLivroModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [currentLivro, setCurrentLivro] = useState(null);

  const canManageLibrary =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster";

  const handleSaveLivro = async (formData) => {
    try {
      setActionError("");
      if (currentLivro && currentLivro.id) {
        await updateLivro(currentLivro.id, formData);
      } else {
        await createLivro(formData);
      }
      refetch(); // 3. Atualiza a lista com `refetch`
      setIsLivroModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar o livro:", err);
      setActionError(err.response?.data?.message || "Erro ao salvar o livro.");
    }
  };

  const handleRegistrarEmprestimo = async (emprestimoData) => {
    try {
      setActionError("");
      await registrarEmprestimo(emprestimoData);
      refetch(); // 3. Atualiza a lista com `refetch`
      setIsEmprestimoModalOpen(false);
    } catch (err) {
      console.error("Erro ao registar empréstimo:", err);
      setActionError(
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
        setActionError("");
        await registrarDevolucao(emprestimoAtivo.id);
        refetch(); // 3. Atualiza a lista com `refetch`
      } catch (err) {
        console.error("Erro ao registar devolução:", err);
        setActionError(
          err.response?.data?.message || "Erro ao registar a devolução."
        );
      }
    }
  };

  const handleReservarLivro = async (livroId) => {
    if (window.confirm("Deseja entrar na fila de reserva para este livro?")) {
      try {
        setActionError("");
        await reservarLivro(livroId);
        alert("Reserva realizada com sucesso!");
        refetch(); // 3. Atualiza a lista com `refetch`
      } catch (err) {
        console.error("Erro ao realizar reserva:", err);
        setActionError(
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

      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}

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
            {/* 4. Adicionado tratamento para estado vazio */}
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
