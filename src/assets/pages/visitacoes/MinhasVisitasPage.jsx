import React from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getMyVisitas } from "../../../services/visitacaoService";
import "../../styles/TableStyles.css";

const MinhasVisitasPage = () => {
  const {
    data: visitas,
    isLoading,
    error: fetchError,
  } = useDataFetching(getMyVisitas);

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
    </div>
  );
};

export default MinhasVisitasPage;
