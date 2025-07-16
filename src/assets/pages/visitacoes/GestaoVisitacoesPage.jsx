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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const {
    data: allVisitas,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getVisitas);

  const filteredVisitas = useMemo(() => {
    if (!allVisitas) return [];

    const sortedVisitas = [...allVisitas].sort((a, b) => {
      const dateComparison = new Date(b.dataSessao) - new Date(a.dataSessao);
      if (dateComparison !== 0) return dateComparison;

      const nameA = a.visitante?.NomeCompleto || "";
      const nameB = b.visitante?.NomeCompleto || "";
      return nameA.localeCompare(nameB);
    });

    return sortedVisitas.filter((visita) => {
      const nomeMembro = visita.visitante?.NomeCompleto || "";
      const nomeLoja = visita.loja?.nome || "";

      return (
        nomeMembro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nomeLoja.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [allVisitas, searchQuery]);

  const paginatedVisitas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVisitas.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisitas, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredVisitas.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

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
        // Extrai o ID do membro do array para a chamada de atualização
        const payload = {
          ...formData,
          lodgeMemberId: formData.lodgeMemberId[0],
        };
        await updateVisita(currentVisita.id, payload);
        showSuccessToast("Registro de visita atualizado com sucesso!");
      } else {
        // Criação em massa
        const { lodgeMemberId, ...visitaData } = formData;
        const promises = lodgeMemberId.map(memberId => 
          createVisita({ ...visitaData, lodgeMemberId: memberId })
        );

        const results = await Promise.allSettled(promises);

        const successCount = results.filter(r => r.status === 'fulfilled').length;
        const errorCount = results.filter(r => r.status === 'rejected').length;

        if (successCount > 0) {
          showSuccessToast(`${successCount} registro(s) de visita criado(s) com sucesso!`);
        }
        if (errorCount > 0) {
          showErrorToast(`${errorCount} registro(s) falharam ao ser criados.`);
          console.error("Falhas na criação em massa:", results.filter(r => r.status === 'rejected'));
        }
      }
      refetch();
      setIsModalOpen(false);
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Erro ao salvar o registro."
      );
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
              <th>Data do Registro</th>
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
            ) : paginatedVisitas.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 6 : 5} style={{ textAlign: "center" }}>
                  Nenhum registro de visitação encontrado.
                </td>
              </tr>
            ) : (
              paginatedVisitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.visitante?.NomeCompleto || "N/A"}</td>
                  <td>
                    {`${visita.loja?.nome || "N/A"}${
                      visita.loja?.numero ? `, nº ${visita.loja.numero}` : ""
                    }`}
                  </td>
                  <td>
                    {visita.loja
                      ? `${visita.loja.cidade}-${visita.loja.estado}`
                      : "N/A"}
                  </td>
                  <td>
                    {new Date(visita.dataSessao).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>
                    {new Date(visita.createdAt).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
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

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn-pagination"
          >
            Próximo
          </button>
        </div>
      )}

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
