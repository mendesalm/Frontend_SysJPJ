import React, { useState, useEffect, useCallback } from 'react';
import { getRelatorioOrcamentario, setOrcamento } from '../../../services/financeService';
import './OrcamentoPage.css';

const OrcamentoPage = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());

  const fetchRelatorio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getRelatorioOrcamentario(ano);
      setRelatorio(response.data);
    } catch (err) {
      console.error("Erro ao buscar relatório orçamentário:", err);
      setError('Falha ao carregar o relatório.');
    } finally {
      setIsLoading(false);
    }
  }, [ano]);

  useEffect(() => {
    fetchRelatorio();
  }, [fetchRelatorio]);
  
  const handleOrcamentoChange = (contaId, novoValor) => {
    // Atualiza o estado localmente para feedback imediato
    const valorNumerico = parseFloat(novoValor) || 0;
    setRelatorio(prevRelatorio =>
      prevRelatorio.map(item =>
        item.contaId === contaId ? { ...item, valorOrcado: valorNumerico } : item
      )
    );
  };
  
  const handleSaveOrcamento = async (contaId, valorOrcado) => {
    try {
      await setOrcamento({ ano, contaId, valorOrcado });
      // Opcional: mostrar uma notificação de sucesso
    } catch (err) {
      console.error("Erro ao salvar orçamento:", err);
      setError(`Erro ao salvar orçamento para a conta ID ${contaId}.`);
      fetchRelatorio(); // Recarrega os dados para reverter a alteração otimista
    }
  };

  return (
    <div className="orcamento-container">
      <div className="orcamento-header">
        <h1>Gestão de Orçamento</h1>
        <div className="filter-container">
          <label htmlFor="ano">Ano:</label>
          <input
            type="number"
            id="ano"
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value, 10))}
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-responsive">
        <table>
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
              <tr><td colSpan="5">A carregar...</td></tr>
            ) : relatorio.map(item => (
              <tr key={item.contaId}>
                <td>{item.nomeConta}</td>
                <td><span className={`status-badge ${item.tipo === 'Receita' ? 'status-aprovado' : 'status-rejeitado'}`}>{item.tipo}</span></td>
                <td>
                  <input
                    type="number"
                    className="orcamento-input"
                    value={item.valorOrcado}
                    onChange={(e) => handleOrcamentoChange(item.contaId, e.target.value)}
                    onBlur={(e) => handleSaveOrcamento(item.contaId, parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td style={{color: item.tipo === 'Receita' ? 'green' : 'red'}}>{item.valorRealizado.toFixed(2)}</td>
                <td style={{color: item.diferenca >= 0 ? 'green' : 'red'}}>{item.diferenca.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrcamentoPage;
