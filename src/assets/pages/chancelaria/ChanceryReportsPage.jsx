import React, { useState } from "react";
import * as relatoriosService from "../../../services/relatoriosService";
import { showErrorToast, showSuccessToast } from "../../../utils/notifications";
import "./ChanceryReportsPage.css";

const ChanceryReportsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Estados para os filtros de data e mês
  const [frequenciaParams, setFrequenciaParams] = useState({
    dataInicio: "",
    dataFim: "",
  });
  const [visitacoesParams, setVisitacoesParams] = useState({
    dataInicio: "",
    dataFim: "",
  });
  const [aniversariantesParams, setAniversariantesParams] = useState({
    mes: new Date().getMonth() + 1,
  });
  const [datasMaconicasParams, setDatasMaconicasParams] = useState({
    mes: new Date().getMonth() + 1,
  });
  const [comissoesParams, setComissoesParams] = useState({
    dataInicio: "",
    dataFim: "",
  });

  const handleGenerateReport = async (reportFunction, params = []) => {
    // Validação simples para relatórios com parâmetros de data
    if (params.includes("") && params.length > 0) {
      showErrorToast(
        "Por favor, preencha todos os campos de data para este relatório."
      );
      return;
    }

    setIsLoading(true);
    try {
      await reportFunction(...params);
      showSuccessToast("O seu relatório está a ser descarregado.");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      showErrorToast(
        error.response?.data?.message || "Não foi possível gerar o relatório."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Relatórios da Chancelaria</h1>
      </div>

      {isLoading && (
        <p className="loading-message">
          A gerar relatório, por favor aguarde...
        </p>
      )}

      <div className="reports-grid">
        {/* Quadro de Obreiros */}
        <div className="report-card">
          <h3>Quadro de Obreiros</h3>
          <p>
            Gera uma lista completa com os dados de todos os membros da Loja.
          </p>
          <button
            onClick={() =>
              handleGenerateReport(relatoriosService.getRelatorioMembros)
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Controle de Frequência */}
        <div className="report-card">
          <h3>Controle de Frequência</h3>
          <p>
            Analisa a frequência dos membros em sessão num período selecionado.
          </p>
          <div className="report-filters">
            <input
              type="date"
              value={frequenciaParams.dataInicio}
              onChange={(e) =>
                setFrequenciaParams({
                  ...frequenciaParams,
                  dataInicio: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={frequenciaParams.dataFim}
              onChange={(e) =>
                setFrequenciaParams({
                  ...frequenciaParams,
                  dataFim: e.target.value,
                })
              }
            />
          </div>
          <button
            onClick={() =>
              handleGenerateReport(relatoriosService.getRelatorioFrequencia, [
                frequenciaParams.dataInicio,
                frequenciaParams.dataFim,
              ])
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Relatório de Visitações */}
        <div className="report-card">
          <h3>Relatório de Visitações</h3>
          <p>
            Lista todas as visitações realizadas pelos membros da Loja a outras
            Oficinas.
          </p>
          <div className="report-filters">
            <input
              type="date"
              value={visitacoesParams.dataInicio}
              onChange={(e) =>
                setVisitacoesParams({
                  ...visitacoesParams,
                  dataInicio: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={visitacoesParams.dataFim}
              onChange={(e) =>
                setVisitacoesParams({
                  ...visitacoesParams,
                  dataFim: e.target.value,
                })
              }
            />
          </div>
          <button
            onClick={() =>
              handleGenerateReport(relatoriosService.getRelatorioVisitacoes, [
                visitacoesParams.dataInicio,
                visitacoesParams.dataFim,
              ])
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Relatório de Aniversariantes */}
        <div className="report-card">
          <h3>Aniversariantes do Mês</h3>
          <p>
            Lista os aniversários de nascimento de membros e familiares no mês.
          </p>
          <div className="report-filters">
            <input
              type="number"
              min="1"
              max="12"
              value={aniversariantesParams.mes}
              onChange={(e) =>
                setAniversariantesParams({ mes: e.target.value })
              }
            />
          </div>
          <button
            onClick={() =>
              handleGenerateReport(
                relatoriosService.getRelatorioAniversariantes,
                [aniversariantesParams.mes]
              )
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Relatório de Cargos */}
        <div className="report-card">
          <h3>Cargos de Gestão</h3>
          <p>
            Exibe a lista atual de todos os oficiais e seus respectivos cargos
            na Loja.
          </p>
          <button
            onClick={() =>
              handleGenerateReport(relatoriosService.getRelatorioCargosGestao)
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Relatório de Datas Maçônicas */}
        <div className="report-card">
          <h3>Datas Maçônicas</h3>
          <p>
            Aniversários de Iniciação, Elevação e Exaltação dos membros no mês.
          </p>
          <div className="report-filters">
            <input
              type="number"
              min="1"
              max="12"
              value={datasMaconicasParams.mes}
              onChange={(e) => setDatasMaconicasParams({ mes: e.target.value })}
            />
          </div>
          <button
            onClick={() =>
              handleGenerateReport(
                relatoriosService.getRelatorioDatasMaconicas,
                [datasMaconicasParams.mes]
              )
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>

        {/* Relatório de Comissões */}
        <div className="report-card">
          <h3>Relatório de Comissões</h3>
          <p>Lista todas as comissões de trabalho e seus membros.</p>
          <div className="report-filters">
            <input
              type="date"
              value={comissoesParams.dataInicio}
              onChange={(e) =>
                setComissoesParams({
                  ...comissoesParams,
                  dataInicio: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={comissoesParams.dataFim}
              onChange={(e) =>
                setComissoesParams({
                  ...comissoesParams,
                  dataFim: e.target.value,
                })
              }
            />
          </div>
          <button
            onClick={() =>
              handleGenerateReport(relatoriosService.getRelatorioComissoes, [
                comissoesParams.dataInicio,
                comissoesParams.dataFim,
              ])
            }
            disabled={isLoading}
          >
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChanceryReportsPage;
