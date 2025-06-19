import React, { useState, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getVisitas,
  deleteVisita,
  createVisita,
  updateVisita,
} from "../../../services/visitacaoService";
import Modal from "../../../components/modal/Modal";
import VisitacaoForm from "./VisitacaoForm";
import "../../styles/TableStyles.css";
import "../../styles/FormStyles.css";
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const GestaoVisitacoesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVisita, setCurrentVisita] = useState(null);

  const {
    data: allVisitas,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getVisitas);

  const filteredVisitas = useMemo(() => {
    if (!allVisitas) return [];
    return allVisitas.filter(
      (visita) =>
        visita.membro?.NomeCompleto.toLowerCase().includes(
          searchQuery.toLowerCase()
        ) ||
        visita.nomeLojaVisitada
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [allVisitas, searchQuery]);

  const canManage =
    user?.credencialAcesso === "Diretoria" ||
    user?.credencialAcesso === "Webmaster" ||
    user?.credencialAcesso === "Chanceler";

  const handleDelete = async (id) => {
    if (
      window.confirm("Tem certeza que deseja apagar este registro de visita?")
    ) {
      try {
        await deleteVisita(id);
        refetch();
        showSuccessToast("Registro de visita apagado com sucesso!");
      } catch (err) {
        showErrorToast("Não foi possível apagar o registro.");
        console.error(err);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentVisita) {
        await updateVisita(currentVisita.id, formData);
      } else {
        await createVisita(formData);
      }
      refetch();
      setIsModalOpen(false);
      showSuccessToast("Registro de visita salvo com sucesso!");
    } catch (err) {
      showErrorToast("Erro ao salvar o registro.");
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentVisita(null);
    setIsModalOpen(true);
  };
  const openEditModal = (visita) => {
    setCurrentVisita(visita);
    setIsModalOpen(true);
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Registros de Visitação</h1>
        {canManage && (
          <button className="btn-action btn-approve" onClick={openCreateModal}>
            + Novo Registro
          </button>
        )}
      </div>

      <div className="filter-bar" style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Buscar por nome do membro ou da loja..."
          className="form-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Membro</th>
              <th>Loja Visitada</th>
              <th>Oriente</th>
              <th>Data da Visita</th>
              <th>Tipo de Sessão</th>
              {canManage && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : filteredVisitas.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  Nenhum registro de visitação encontrado.
                </td>
              </tr>
            ) : (
              filteredVisitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.membro?.NomeCompleto || "N/A"}</td>
                  <td>{visita.nomeLojaVisitada}</td>
                  <td>{visita.orienteLojaVisitada}</td>
                  <td>
                    {new Date(visita.dataVisita).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{visita.tipoSessao}</td>
                  {canManage && (
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => openEditModal(visita)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(visita.id)}
                      >
                        Apagar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVisita ? "Editar Registro" : "Novo Registro de Visitação"}
      >
        <VisitacaoForm
          visitaToEdit={currentVisita}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default GestaoVisitacoesPage;
