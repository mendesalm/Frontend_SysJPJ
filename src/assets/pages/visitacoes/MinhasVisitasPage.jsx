import React from "react";
import { useAuth } from "../../../hooks/useAuth"; // Importa o hook de autenticação
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getMyVisitas } from "../../../services/visitacaoService";
import "../../styles/TableStyles.css";

const MinhasVisitasPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // Obtém o usuário e o status de carregamento da autenticação

  // CORREÇÃO: A busca de dados só é executada se o usuário estiver autenticado.
  // O hook useDataFetching é chamado condicionalmente com base na presença do usuário.
  const {
    data: visitas,
    isLoading: isLoadingVisitas,
    error: fetchError,
  } = useDataFetching(user ? getMyVisitas : () => Promise.resolve({ data: [] }));

  // O estado de carregamento geral considera a autenticação e a busca de dados.
  const isLoading = isAuthLoading || isLoadingVisitas;

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
            ) : !user ? (
              // Mensagem se o usuário não estiver logado.
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Por favor, faça login para ver suas visitações.
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
    </div>
  );
};

export default MinhasVisitasPage;
