import React, { useState } from 'react';
import { getRelatorioMembros, getRelatorioFinanceiro, getRelatorioFrequencia } from '../../../services/relatoriosService';
import './RelatoriosPage.css';

const RelatoriosPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para os filtros
  const [financeiro, setFinanceiro] = useState({ mes: new Date().getMonth() + 1, ano: new Date().getFullYear() });
  const [frequencia, setFrequencia] = useState({ dataInicio: '', dataFim: '' });

  const handleGerarRelatorio = async (geradorRelatorio, params) => {
    setIsLoading(true);
    setError('');
    try {
      await geradorRelatorio(...params);
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      setError("Não foi possível gerar o relatório. Verifique os filtros e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relatorios-container">
      <h1>Central de Relatórios</h1>
      
      {isLoading && <p className="loading-message">A gerar relatório, por favor aguarde...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="relatorios-grid">
        {/* Card para Relatório de Membros */}
        <div className="relatorio-card">
          <h3>Quadro de Obreiros</h3>
          <p>Gera uma lista completa de todos os membros ativos da Loja.</p>
          <button onClick={() => handleGerarRelatorio(getRelatorioMembros, [])} disabled={isLoading}>
            Gerar PDF
          </button>
        </div>

        {/* Card para Relatório Financeiro */}
        <div className="relatorio-card">
          <h3>Balancete Financeiro Mensal</h3>
          <p>Gera o balancete de receitas e despesas para um mês específico.</p>
          <div className="filter-inputs">
            <input type="number" value={financeiro.mes} onChange={e => setFinanceiro({...financeiro, mes: e.target.value})} placeholder="Mês" />
            <input type="number" value={financeiro.ano} onChange={e => setFinanceiro({...financeiro, ano: e.target.value})} placeholder="Ano" />
          </div>
          <button onClick={() => handleGerarRelatorio(getRelatorioFinanceiro, [financeiro.mes, financeiro.ano])} disabled={isLoading}>
            Gerar PDF
          </button>
        </div>

        {/* Card para Relatório de Frequência */}
        <div className="relatorio-card">
          <h3>Relatório de Frequência</h3>
          <p>Analisa a frequência dos membros em sessão num período.</p>
          <div className="filter-inputs">
             <input type="date" value={frequencia.dataInicio} onChange={e => setFrequencia({...frequencia, dataInicio: e.target.value})} />
             <input type="date" value={frequencia.dataFim} onChange={e => setFrequencia({...frequencia, dataFim: e.target.value})} />
          </div>
          <button onClick={() => handleGerarRelatorio(getRelatorioFrequencia, [frequencia.dataInicio, frequencia.dataFim])} disabled={isLoading}>
            Gerar PDF
          </button>
        </div>
        
        {/* Adicione mais cards para outros relatórios aqui */}
      </div>
    </div>
  );
};

export default RelatoriosPage;
