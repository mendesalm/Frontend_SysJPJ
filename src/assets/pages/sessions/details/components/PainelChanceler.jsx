import React, { useState, useEffect } from "react";
import { getPainelChanceler } from "../../../../../services/chancelerService";
import { getProximoResponsavel } from "../../../../../services/escalaService";
import { showErrorToast } from "../../../../../utils/notifications";

const PainelChanceler = () => {
  // CORREÇÃO: Agora temos estados para ambas as datas.
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [dadosPainel, setDadosPainel] = useState(null);
  const [proximoJantar, setProximoJantar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProximoResponsavel()
      .then((response) => setProximoJantar(response.data))
      .catch((error) =>
        console.error("Erro ao buscar próximo responsável:", error)
      );
  }, []);

  useEffect(() => {
    let dataInicioBusca = dataInicio;
    let dataFimBusca = dataFim;

    // Define valores padrão para as datas se estiverem vazias.
    if (!dataInicioBusca) {
      dataInicioBusca = new Date().toISOString().split("T")[0];
      setDataInicio(dataInicioBusca);
    }
    if (!dataFimBusca) {
      const dataFinalPadrao = new Date(dataInicioBusca);
      dataFinalPadrao.setDate(dataFinalPadrao.getDate() + 30); // Padrão de 30 dias de intervalo
      dataFimBusca = dataFinalPadrao.toISOString().split("T")[0];
      setDataFim(dataFimBusca);
    }

    const fetchPanelData = async () => {
      setIsLoading(true);
      try {
        // CORREÇÃO: Passando ambas as datas para o serviço.
        const response = await getPainelChanceler(
          dataInicioBusca,
          dataFimBusca
        );
        setDadosPainel(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do painel:", error);
        showErrorToast(
          "Não foi possível carregar os dados de aniversariantes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPanelData();
  }, [dataInicio, dataFim]); // O efeito agora depende de ambas as datas.

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
        {/* CORREÇÃO: Agora temos dois inputs de data */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group">
            <label htmlFor="dataInicio">De:</label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dataFim">Até:</label>
            <input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="painel-grid">
        {/* CARD DO PRÓXIMO DA ESCALA */}
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

        {/* Renderização do restante do painel (aniversariantes, etc.) */}
        {isLoading ? (
          <div className="painel-card">
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
