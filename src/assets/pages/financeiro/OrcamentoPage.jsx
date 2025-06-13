import React, { useState, useMemo } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getRelatorioOrcamentario,
  setOrcamento,
} from "../../../services/financeService";
import "../../styles/TableStyles.css";
import "./OrcamentoPage.css"; // Mantém os estilos específicos da página

const OrcamentoPage = () => {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [actionError, setActionError] = useState("");

  // 2. O hook busca os dados e refaz a busca automaticamente quando `ano` muda.
  // Usamos useMemo para garantir que o array de parâmetros seja estável.
  const params = useMemo(() => [ano], [ano]);
  const {
    data: relatorio,
    setData: setRelatorio, // Pegamos o `setData` para atualizações otimistas
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getRelatorioOrcamentario, params);

  const handleOrcamentoChange = (contaId, novoValor) => {
    const valorNumerico = parseFloat(novoValor) || 0;
    // Atualiza o estado localmente para feedback imediato na UI (Atualização Otimista)
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
      setActionError("");
      await setOrcamento({ ano, contaId, valorOrcado });
      // Podemos exibir uma notificação de sucesso aqui no futuro.
      // Opcionalmente, pode-se chamar refetch() para garantir 100% de consistência,
      // mas a atualização otimista já melhora a UX.
    } catch (err) {
      console.error("Erro ao salvar orçamento:", err);
      setActionError(`Erro ao salvar orçamento para a conta ID ${contaId}.`);
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
            className="form-input" // Usando classe de estilo padronizada
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}

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
              // 3. Tratamento para estado vazio
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
