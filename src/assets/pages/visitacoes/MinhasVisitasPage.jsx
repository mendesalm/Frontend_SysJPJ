import React, { useMemo } from "react"; // Adicionado useMemo
import { useAuth } from "../../../hooks/useAuth"; // Importa o hook de autenticação
import { useDataFetching } from "../../../hooks/useDataFetching";
import { getVisitas } from "../../../services/visitacaoService";
import "../../styles/TableStyles.css";

const MinhasVisitasPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  // CORREÇÃO: Define os parâmetros para a busca, incluindo o ID do membro logado.
  // Usamos useMemo para evitar que o objeto seja recriado em cada renderização.
  const fetchParams = useMemo(() => {
    if (!user) return null; // Não busca se o usuário não estiver carregado
    return { lodgeMemberId: user.id };
  }, [user]);

  // CORREÇÃO: O hook agora chama a função 'getVisitas' com os parâmetros corretos.
  const {
    data: visitas,
    isLoading: isLoadingVisitas,
    error: fetchError,
  } = useDataFetching(
    fetchParams ? getVisitas : () => Promise.resolve({ data: [] }),
    [fetchParams]
  );

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
