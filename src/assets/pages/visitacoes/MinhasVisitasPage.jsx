// src/assets/pages/visitacoes/MinhasVisitasPage.jsx
import React, { useState, useMemo } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getMyVisitas } from "../../../services/visitacaoService";
import "../../styles/TableStyles.css";

// --- INÍCIO DA CORREÇÃO: Adicionando o componente de controles ---
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
// --- FIM DA CORREÇÃO ---

const MinhasVisitasPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useMemo(
    () => ({ page: currentPage, limit: 10 }),
    [currentPage]
  );
  const {
    data: response,
    isLoading,
    error: fetchError,
  } = useDataFetching(getMyVisitas, [params]);

  const visitas = response?.data || [];
  const pagination = response?.pagination || { totalPages: 1 };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Minhas Visitações</h1>
      </div>
      {fetchError && <p className="error-message">{fetchError}</p>}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Loja Visitada</th>
              <th>Oriente</th>
              <th>Data da Visita</th>
              <th>Tipo de Sessão</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : visitas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Você ainda não registrou nenhuma visita.
                </td>
              </tr>
            ) : (
              visitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.nomeLojaVisitada}</td>
                  <td>{visita.orienteLojaVisitada}</td>
                  <td>
                    {new Date(visita.dataVisita).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{visita.tipoSessao}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- INÍCIO DA CORREÇÃO: Renderizando os controles de paginação --- */}
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
      {/* --- FIM DA CORREÇÃO --- */}
    </div>
  );
};

export default MinhasVisitasPage;
