import React, { useState, useEffect, useCallback } from "react";
import { useDataFetching } from "~/hooks/useDataFetching";
import { getSessions } from "~/services/sessionService";
import { formatFullDate } from "~/utils/dateUtils";
import { showErrorToast } from "~/utils/notifications";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import "~/assets/styles/TableStyles.css"; // Reutilizar estilos de tabela
import "./HistoricoSessoesPage.css"; // Importar o novo CSS

const HistoricoSessoesPage = () => {
  const [filterDate, setFilterDate] = useState(""); // Para o filtro de data
  const [filteredSessions, setFilteredSessions] = useState([]);

  // Busca as últimas 5 sessões aprovadas inicialmente
  const fetchInitialSessions = useCallback(() => {
    return getSessions({
      status: "Aprovada",
      limit: 5,
      sortBy: "dataSessao",
      order: "DESC",
    });
  }, []);

  const {
    data: initialSessions,
    isLoading: isLoadingInitial,
    error: initialError,
  } = useDataFetching(fetchInitialSessions);

  useEffect(() => {
    if (initialSessions) {
      setFilteredSessions(initialSessions);
    }
  }, [initialSessions]);

  const handleSearch = useCallback(async () => {
    if (!filterDate) {
      setFilteredSessions(initialSessions || []);
      return;
    }
    try {
      const response = await getSessions({
        dataSessao: filterDate, // Assumindo que a API pode filtrar por data exata
        status: "Aprovada",
        sortBy: "dataSessao",
        order: "DESC",
      });
      setFilteredSessions(response.data);
    } catch (err) {
      showErrorToast("Erro ao buscar sessões históricas.");
      console.error("Erro ao buscar sessões históricas:", err);
      setFilteredSessions([]);
    }
  }, [filterDate, initialSessions]);

  const getFileUrl = (path) => {
    if (!path) return "#";
    return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleViewDocument = (relativePath) => {
    if (relativePath) {
      const fullUrl = getFileUrl(relativePath);
      window.open(fullUrl, "_blank");
    } else {
      showErrorToast("Documento não disponível.");
    }
  };

  const handleDownloadDocument = (relativePath, filename) => {
    if (relativePath) {
      const fullUrl = getFileUrl(relativePath);
      const link = document.createElement('a');
      link.href = fullUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showErrorToast("Documento não disponível para download.");
    }
  };

  if (isLoadingInitial) {
    return <div className="container">A carregar histórico de sessões...</div>;
  }

  if (initialError) {
    return <div className="container error-message">Erro ao carregar histórico: {initialError.message}</div>;
  }

  return (
    <div className="historico-sessoes-container">
      <h1 className="page-title">Histórico de Sessões</h1>

      <div className="filter-bar">
        <input
          type="date"
          className="form-input"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Balaústre</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td>{formatFullDate(session.dataSessao)}</td>
                  <td>{`${session.tipoSessao} - ${session.subtipoSessao}`}</td>
                  <td>
                    {session.balaustre?.caminhoPdfLocal ? (
                      <>
                        <button
                          onClick={() => handleViewDocument(session.balaustre.caminhoPdfLocal)}
                          className="btn-action-small btn-view"
                          title="Visualizar Balaústre"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(session.balaustre.caminhoPdfLocal, `Balaustre-${session.id}.pdf`)}
                          className="btn-action-small btn-download"
                          title="Baixar Balaústre"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <Link to={`/sessoes/${session.id}`} className="btn-action btn-primary">
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhuma sessão histórica encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoSessoesPage;