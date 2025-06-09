import React from 'react';

// Componente para exibir os dados do dashboard de um Administrador ou Diretoria
const AdminDashboard = ({ data }) => {
  const { resumoFinanceiro, totalMembros, proximosAniversariantes, proximosEventos } = data;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Resumo Financeiro ({resumoFinanceiro.periodo})</h3>
        <p className="finance-receita">Receitas: R$ {resumoFinanceiro.totalReceitas.toFixed(2)}</p>
        <p className="finance-despesa">Despesas: R$ {resumoFinanceiro.totalDespesas.toFixed(2)}</p>
        <p className="finance-saldo">Saldo: R$ {resumoFinanceiro.saldo.toFixed(2)}</p>
      </div>

      <div className="dashboard-card">
        <h3>Quadro de Obreiros</h3>
        <p className="quadro-total">{totalMembros} Membros Ativos</p>
        {/* Adicionar um link para a página de gestão de membros aqui */}
      </div>

      <div className="dashboard-card">
        <h3>Próximos Aniversariantes</h3>
        <ul>
          {proximosAniversariantes.length > 0 ? proximosAniversariantes.map((aniv, index) => (
            <li key={index}>{aniv.nome} - {aniv.data} ({aniv.tipo})</li>
          )) : <p>Nenhum aniversariante nos próximos dias.</p>}
        </ul>
      </div>

      <div className="dashboard-card">
        <h3>Próximos Eventos</h3>
        <ul>
          {proximosEventos.length > 0 ? proximosEventos.map(evento => (
            <li key={evento.id}>{evento.titulo} - {new Date(evento.dataHoraInicio).toLocaleDateString()}</li>
          )) : <p>Nenhum evento agendado.</p>}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
