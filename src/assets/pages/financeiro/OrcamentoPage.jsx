import React, { useState, useMemo } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching";
import {
  getRelatorioOrcamentario,
  setOrcamento,
} from "../../../services/financeService";
import "../../styles/TableStyles.css";
import "./OrcamentoPage.css";

// 1. IMPORTAMOS AS NOSSAS FUNÇÕES DE NOTIFICAÇÃO
import { showSuccessToast, showErrorToast } from "../../../utils/notifications";

const OrcamentoPage = () => {
  const [ano, setAno] = useState(new Date().getFullYear());

  // 2. O ESTADO DE ERRO PARA AÇÕES NÃO É MAIS NECESSÁRIO
  // const [error, setError] = useState('');

  const params = useMemo(() => [ano], [ano]);
  const {
    data: relatorio,
    setData: setRelatorio,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getRelatorioOrcamentario, params);

  const handleOrcamentoChange = (contaId, novoValor) => {
    const valorNumerico = parseFloat(novoValor) || 0;
    setRelatorio((prevRelatorio) =>
      prevRelatorio.map((item) =>
        item.contaId === contaId
          ? { ...item, valorOrcado: valorNumerico }
          : item
      )
    );
  };

  const handleSaveOrcamento = async (contaId, valorOrcado) => {
    try {
      await setOrcamento({ ano, contaId, valorOrcado });
      // 3. ADICIONAMOS A NOTIFICAÇÃO DE SUCESSO
      // Não é necessário `refetch()` aqui, pois a atualização otimista já ocorreu.
      showSuccessToast("Orçamento salvo!");
    } catch (err) {
      console.error("Erro ao salvar orçamento:", err);
      // 4. SUBSTITUÍMOS O ESTADO DE ERRO PELA NOTIFICAÇÃO DE ERRO
      showErrorToast(`Erro ao salvar orçamento para a conta ID ${contaId}.`);
      refetch(); // Recarrega os dados para reverter a alteração otimista em caso de erro.
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Orçamento</h1>
        <div className="filter-container">
          <label htmlFor="ano">Ano:</label>
          <input
            type="number"
            id="ano"
            className="form-input"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      {/* 5. A EXIBIÇÃO DE ERRO É SIMPLIFICADA */}
      {fetchError && <p className="error-message">{fetchError}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Valor Orçado (R$)</th>
              <th>Valor Realizado (R$)</th>
              <th>Diferença (R$)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : relatorio.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum dado orçamentário encontrado para o ano selecionado.
                </td>
              </tr>
            ) : (
              relatorio.map((item) => (
                <tr key={item.contaId}>
                  <td>{item.nomeConta}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.tipo === "Receita"
                          ? "status-aprovado"
                          : "status-rejeitado"
                      }`}
                    >
                      {item.tipo}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="orcamento-input"
                      value={item.valorOrcado}
                      onChange={(e) =>
                        handleOrcamentoChange(item.contaId, e.target.value)
                      }
                      onBlur={(e) =>
                        handleSaveOrcamento(
                          item.contaId,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td
                    style={{
                      color: item.tipo === "Receita" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.valorRealizado.toFixed(2)}
                  </td>
                  <td
                    style={{
                      color: item.diferenca >= 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.diferenca.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrcamentoPage;
