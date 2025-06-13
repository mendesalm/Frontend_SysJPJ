import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getContas,
  createConta,
  updateConta,
  deleteConta,
} from "../../../services/financeService";
import Modal from "../../../components/modal/Modal";
import ContaForm from "./ContaForm";
import "../../styles/TableStyles.css";

const PlanoContasPage = () => {
  // 2. Lógica de busca de dados simplificada com o hook
  const {
    data: contas,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getContas);

  const [actionError, setActionError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConta, setCurrentConta] = useState(null);

  const handleSave = async (formData) => {
    try {
      setActionError("");
      if (currentConta) {
        await updateConta(currentConta.id, formData);
      } else {
        await createConta(formData);
      }
      refetch(); // 3. Atualiza a lista usando o refetch do hook
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erro ao salvar a conta.";
      setActionError(errorMsg);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Atenção: só é possível apagar contas que não possuem lançamentos. Deseja continuar?"
      )
    ) {
      try {
        setActionError("");
        await deleteConta(id);
        refetch(); // 3. Atualiza a lista usando o refetch do hook
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Não foi possível apagar a conta.";
        setActionError(errorMsg);
        console.error(err);
      }
    }
  };

  const openModalToCreate = () => {
    setCurrentConta(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (conta) => {
    setCurrentConta(conta);
    setIsModalOpen(true);
  };

  if (isLoading)
    return <div className="table-page-container">A carregar...</div>;

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Plano de Contas</h1>
        <button onClick={openModalToCreate} className="btn-action btn-approve">
          Nova Conta
        </button>
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
              <th>Nome da Conta</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Tratamento para estado vazio */}
            {!isLoading && contas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhuma conta cadastrada no plano de contas.
                </td>
              </tr>
            ) : (
              contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.nome}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        conta.tipo === "Receita"
                          ? "status-aprovado"
                          : "status-rejeitado"
                      }`}
                    >
                      {conta.tipo}
                    </span>
                  </td>
                  <td>{conta.descricao}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openModalToEdit(conta)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(conta.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentConta ? "Editar Conta" : "Criar Nova Conta"}
      >
        <ContaForm
          contaToEdit={currentConta}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanoContasPage;
