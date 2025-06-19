import React, { useState, useEffect } from "react";
import {
  getSessionById,
  getDadosPainelChanceler,
} from "../../../../../services/sessionService";
import { getProximoResponsavel } from "../../../../../services/escalaService"; // 1. IMPORTAR O NOVO SERVIÇO
import { showErrorToast } from "../../../../../utils/notifications";

const PainelChanceler = ({ sessionId }) => {
  const [dataFim, setDataFim] = useState("");
  const [dadosPainel, setDadosPainel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. ADICIONAR NOVO ESTADO PARA O PRÓXIMO RESPONSÁVEL
  const [proximoJantar, setProximoJantar] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        // Busca os dados da sessão e do próximo responsável em paralelo
        const [sessionRes, proximoRes] = await Promise.all([
          getSessionById(sessionId),
          getProximoResponsavel(),
        ]);

        // Processa dados da sessão
        const date = sessionRes.data.dataSessao;
        const data = new Date(date);
        data.setDate(data.getDate() + 7);
        const dataFinalPadrao = data.toISOString().split("T")[0];
        setDataFim(dataFinalPadrao);

        // 3. ATUALIZA O ESTADO DO PRÓXIMO RESPONSÁVEL
        setProximoJantar(proximoRes.data);
      } catch (error) {
        showErrorToast("Não foi possível carregar todos os dados do painel.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !dataFim) return;

    const fetchPanelData = async () => {
      setIsLoading(true);
      try {
        const response = await getDadosPainelChanceler(sessionId, dataFim);
        setDadosPainel(response.data);
      } catch (error) {
        showErrorToast(
          "Não foi possível carregar os dados do painel do Chanceler."
        );
        console.error(error);
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

  if (isLoading)
    return (
      <div className="card">
        <p>Carregando dados do painel...</p>
      </div>
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
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="painel-grid">
        {/* Card do Jantar Atual */}
        <div className="painel-card">
          <div className="painel-card-header">
            <span className="icon">🍽️</span>
            <h4>Jantar da Sessão Atual</h4>
          </div>
          <div className="painel-card-body">
            <p>
              <strong>Responsável:</strong>{" "}
              {dadosPainel?.jantar?.responsavelNome || "Não definido"}
            </p>
            <p>
              <strong>Cônjuge:</strong>{" "}
              {dadosPainel?.jantar?.conjugeNome || "Não informado"}
            </p>
          </div>
        </div>

        {/* 4. ADICIONAR NOVO CARD PARA O PRÓXIMO JANTAR */}
        <div className="painel-card">
          <div className="painel-card-header">
            <span className="icon">➡️</span>
            <h4>Próximo Jantar</h4>
          </div>
          <div className="painel-card-body">
            <p>
              <strong>Responsável:</strong>{" "}
              {proximoJantar?.responsavelNome || "A definir"}
            </p>
            <p>
              <strong>Cônjuge:</strong>{" "}
              {proximoJantar?.conjugeNome || "Não informado"}
            </p>
          </div>
        </div>

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
                {dadosPainel?.aniversariantes?.nascimentos?.membros?.length > 0
                  ? dadosPainel.aniversariantes.nascimentos.membros.map(
                      (item) => (
                        <li key={`membro-${item.id}`}>
                          <span className="nome">{item.nome}</span>
                          <span className="data">{formatDate(item.data)}</span>
                        </li>
                      )
                    )
                  : renderEmptyState()}
              </ul>
            </div>
            <div className="split-column">
              <h5>Familiares</h5>
              <ul className="aniversariantes-lista">
                {dadosPainel?.aniversariantes?.nascimentos?.familiares?.length >
                0
                  ? dadosPainel.aniversariantes.nascimentos.familiares.map(
                      (item) => (
                        <li key={`familiar-${item.id}`}>
                          <span className="nome">
                            {item.nome}{" "}
                            <span className="parentesco">
                              ({item.parentesco} do Ir∴ {item.membroParente})
                            </span>
                          </span>
                          <span className="data">{formatDate(item.data)}</span>
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
                          ({item.aniversarios.map((a) => a.tipo).join(", ")})
                        </span>
                      </span>
                      <span className="data">{formatDate(item.data)}</span>
                    </li>
                  ))
                : renderEmptyState()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelChanceler;
