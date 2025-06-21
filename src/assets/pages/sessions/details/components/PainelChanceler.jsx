import React, { useState, useEffect } from "react";
import { getDadosPainelChanceler } from "../../../../../services/sessionService";
import { getProximoResponsavel } from "../../../../../services/escalaService";
import { showErrorToast } from "../../../../../utils/notifications";

const PainelChanceler = ({ sessionId }) => {
  const [dataFim, setDataFim] = useState("");
  const [dadosPainel, setDadosPainel] = useState(null); // Para o responsável ATUAL e aniversariantes
  const [proximoJantar, setProximoJantar] = useState(null); // Para o PRÓXIMO responsável
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para buscar o próximo da escala (informação estática)
  useEffect(() => {
    console.log(
      "[PainelChanceler] Buscando o próximo responsável da escala..."
    );
    getProximoResponsavel()
      .then((response) => {
        console.log(
          "[PainelChanceler] Resposta de getProximoResponsavel:",
          response.data
        );
        setProximoJantar(response.data);
      })
      .catch((error) => {
        console.error(
          "[PainelChanceler] Erro ao buscar próximo responsável:",
          error
        );
      });
  }, []); // Executa apenas uma vez quando o componente monta

  // Efeito para buscar os dados do painel (que dependem da data)
  useEffect(() => {
    if (!sessionId) return;

    // Define a data final padrão se ainda não estiver definida
    let dataParaBusca = dataFim;
    if (!dataParaBusca) {
      const hoje = new Date();
      hoje.setDate(hoje.getDate() + 7);
      dataParaBusca = hoje.toISOString().split("T")[0];
      setDataFim(dataParaBusca);
    }

    const fetchPanelData = async () => {
      console.log(
        `[PainelChanceler] Buscando dados do painel para sessão ${sessionId} até ${dataParaBusca}`
      );
      setIsLoading(true);
      try {
        const response = await getDadosPainelChanceler(
          sessionId,
          dataParaBusca
        );
        console.log(
          "[PainelChanceler] Resposta de getDadosPainelChanceler:",
          response.data
        );
        setDadosPainel(response.data);
      } catch (error) {
        console.error(
          "[PainelChanceler] Erro ao buscar dados do painel:",
          error
        );
        showErrorToast(
          "Não foi possível carregar os dados de aniversariantes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanelData();
  }, [sessionId, dataFim]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    });

  const renderEmptyState = () => (
    <p className="empty-state">Nenhum registro no período.</p>
  );

  return (
    <div className="painel-chanceler">
      <div className="painel-header">
        <h3>Painel do Chanceler</h3>
        <div className="form-group">
          <label htmlFor="dataFim">Eventos até:</label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="painel-grid">
        {/* CARD DO RESPONSÁVEL ATUAL - Usa o estado 'dadosPainel' */}
        <div className="painel-card">
          <div className="painel-card-header">
            <span className="icon">🍽️</span>
            <h4>Jantar da Sessão Atual</h4>
          </div>
          <div className="painel-card-body">
            <p>
              <strong>Responsável:</strong>{" "}
              {isLoading
                ? "..."
                : dadosPainel?.jantar?.responsavelNome || "Não definido"}
            </p>
            <p>
              <strong>Cônjuge:</strong>{" "}
              {isLoading
                ? "..."
                : dadosPainel?.jantar?.conjugeNome || "Não informado"}
            </p>
          </div>
        </div>

        {/* CARD DO PRÓXIMO DA ESCALA - Usa o estado 'proximoJantar' */}
        <div className="painel-card">
          <div className="painel-card-header">
            <span className="icon">➡️</span>
            <h4>Próximo Jantar na Escala</h4>
          </div>
          <div className="painel-card-body">
            <p>
              <strong>Responsável:</strong>{" "}
              {proximoJantar?.membro?.NomeCompleto || "A definir"}
            </p>
            <p>
              <strong>Cônjuge:</strong>{" "}
              {proximoJantar?.conjugeNome || "Não informado"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="card">
            <p>Carregando aniversariantes...</p>
          </div>
        ) : (
          <>
            {/* Card de Aniversariantes */}
            <div className="painel-card">
              <div className="painel-card-header">
                <span className="icon">🎂</span>
                <h4>Aniversariantes do Período</h4>
              </div>
              <div className="painel-card-body anniversaries-split">
                <div className="split-column">
                  <h5>Obreiros</h5>
                  <ul className="aniversariantes-lista">
                    {dadosPainel?.aniversariantes?.nascimentos?.membros
                      ?.length > 0
                      ? dadosPainel.aniversariantes.nascimentos.membros.map(
                          (item) => (
                            <li key={`membro-${item.id}`}>
                              <span className="nome">{item.nome}</span>
                              <span className="data">
                                {formatDate(item.data)}
                              </span>
                            </li>
                          )
                        )
                      : renderEmptyState()}
                  </ul>
                </div>
                <div className="split-column">
                  <h5>Familiares</h5>
                  <ul className="aniversariantes-lista">
                    {dadosPainel?.aniversariantes?.nascimentos?.familiares
                      ?.length > 0
                      ? dadosPainel.aniversariantes.nascimentos.familiares.map(
                          (item) => (
                            <li key={`familiar-${item.id}`}>
                              <span className="nome">
                                {item.nome}{" "}
                                <span className="parentesco">
                                  ({item.parentesco} do Ir∴ {item.membroParente}
                                  )
                                </span>
                              </span>
                              <span className="data">
                                {formatDate(item.data)}
                              </span>
                            </li>
                          )
                        )
                      : renderEmptyState()}
                  </ul>
                </div>
              </div>
            </div>
            {/* Cards de Casamentos e Datas Maçônicas */}
            <div className="painel-card">
              <div className="painel-card-header">
                <span className="icon">💍</span>
                <h4>Aniversários de Casamento</h4>
              </div>
              <div className="painel-card-body">
                <ul className="aniversariantes-lista">
                  {dadosPainel?.aniversariantes?.casamentos?.length > 0
                    ? dadosPainel.aniversariantes.casamentos.map((item) => (
                        <li key={`casamento-${item.id}`}>
                          <span className="nome">Ir∴ {item.nome}</span>
                          <span className="data">{formatDate(item.data)}</span>
                        </li>
                      ))
                    : renderEmptyState()}
                </ul>
              </div>
            </div>
            <div className="painel-card">
              <div className="painel-card-header">
                <span className="icon">⭐</span>
                <h4>Datas Maçônicas</h4>
              </div>
              <div className="painel-card-body">
                <ul className="aniversariantes-lista">
                  {dadosPainel?.aniversariantes?.maconicos?.length > 0
                    ? dadosPainel.aniversariantes.maconicos.map((item) => (
                        <li key={`maconico-${item.id}`}>
                          <span className="nome">
                            Ir∴ {item.nome}{" "}
                            <span className="parentesco">
                              ({item.aniversarios.map((a) => a.tipo).join(", ")}
                              )
                            </span>
                          </span>
                          <span className="data">{formatDate(item.data)}</span>
                        </li>
                      ))
                    : renderEmptyState()}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PainelChanceler;
