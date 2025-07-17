import React, { useState, useMemo } from "react";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import * as mensagensService from "../../../../services/mensagensService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";
import Modal from "../../../../components/modal/Modal";
import MensagemForm from "./MensagemForm";
import {
  TIPOS_MENSAGEM,
  SUBTIPOS_MENSAGEM,
} from "../../../../validators/mensagemValidator";
import "../../../../assets/styles/TableStyles.css";

const MensagensPage = () => {
  const [filters, setFilters] = useState({ tipo: "", subtipo: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMensagem, setCurrentMensagem] = useState(null);

  const cleanedParams = useMemo(() => {
    const activeFilters = {};
    if (filters.tipo) {
      activeFilters.tipo = filters.tipo;
    }
    if (filters.subtipo) {
      activeFilters.subtipo = filters.subtipo;
    }
    return activeFilters;
  }, [filters]);

  const {
    data: mensagens,
    isLoading,
    error,
    refetch,
  } = useDataFetching(mensagensService.getMensagens, [cleanedParams]);

  const handleSave = async (formData) => {
    // CORREÇÃO: Cria uma cópia dos dados para não modificar o estado do formulário diretamente.
    const dataToSend = { ...formData };

    // Converte as quebras de linha (Enter) do textarea em tags <br> para o HTML.
    if (dataToSend.conteudo) {
      dataToSend.conteudo = dataToSend.conteudo.replace(/\n/g, "<br />");
    }

    try {
      if (currentMensagem) {
        await mensagensService.updateMensagem(currentMensagem.id, dataToSend);
        showSuccessToast("Mensagem atualizada com sucesso!");
      } else {
        await mensagensService.createMensagem(dataToSend);
        showSuccessToast("Mensagem criada com sucesso!");
      }
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao guardar a mensagem."
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que deseja apagar esta mensagem?")) {
      try {
        await mensagensService.deleteMensagem(id);
        showSuccessToast("Mensagem apagada com sucesso!");
        refetch();
      } catch (err) {
        showErrorToast(
          err.response?.data?.message || "Não foi possível apagar a mensagem."
        );
      }
    }
  };

  const openModal = (mensagem = null) => {
    setCurrentMensagem(mensagem);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Banco de Mensagens</h1>
        <button onClick={() => openModal()} className="btn-action btn-approve">
          + Nova Mensagem
        </button>
      </div>

      <div
        className="table-filters"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <select
          className="form-select"
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
          value={filters.tipo}
        >
          <option value="">Todos os Tipos</option>
          {TIPOS_MENSAGEM.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          onChange={(e) => setFilters({ ...filters, subtipo: e.target.value })}
          value={filters.subtipo}
        >
          <option value="">Todos os Públicos</option>
          {SUBTIPOS_MENSAGEM.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Público</th>
              <th>Conteúdo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  A carregar mensagens...
                </td>
              </tr>
            ) : (
              (mensagens || []).map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.tipo}</td>
                  <td>{msg.subtipo}</td>
                  {/* O dangerouslySetInnerHTML já renderiza o HTML corretamente na tabela */}
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: msg.conteudo.substring(0, 100) + "...",
                      }}
                    />
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        msg.ativo ? "status-aprovado" : "status-rejeitado"
                      }`}
                    >
                      {msg.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => openModal(msg)}
                      className="btn-action btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="btn-action btn-delete"
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
        title={currentMensagem ? "Editar Mensagem" : "Nova Mensagem"}
      >
        <MensagemForm
          mensagemToEdit={currentMensagem}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default MensagensPage;
