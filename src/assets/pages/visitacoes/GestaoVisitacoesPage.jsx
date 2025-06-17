import React, { useState, useMemo, useEffect } from "react"; // Adicionado useEffect para debug
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

// Componente auxiliar para os controles de paginação
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div
      className="pagination-controls"
      style={{
        marginTop: "1.5rem",
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>
        Página {currentPage} de {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>
    </div>
  );
};

const GestaoVisitacoesPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVisita, setCurrentVisita] = useState(null);

  const params = useMemo(
    () => ({ page: currentPage, limit: 10, search: searchQuery }),
    [currentPage, searchQuery]
  );

  // --- INÍCIO DOS LOGS DE DEBUG ---
  useEffect(() => {
    console.log("LOG 0: Componente GestaoVisitacoesPage foi montado.");
  }, []);

  console.log("LOG 1: Parâmetros enviados para a API:", params);
  const {
    data: response,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getVisitas, [params]);

  console.log("LOG 2: Resposta BRUTA recebida pelo hook:", response);

  const visitas = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  console.log("LOG 3: Dados processados para renderização:", {
    visitas,
    pagination,
  });
  // --- FIM DOS LOGS DE DEBUG ---

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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
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
            ) : visitas.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  Nenhum registro de visitação encontrado.
                </td>
              </tr>
            ) : (
              visitas.map((visita) => (
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

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />

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
