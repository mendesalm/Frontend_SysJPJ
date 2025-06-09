import React from 'react';

// Componente para exibir os dados do dashboard de um Membro comum
const MemberDashboard = ({ data }) => {
  const { emprestimosPendentes, proximosEventos } = data;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>Meus Empréstimos na Biblioteca</h3>
        <ul>
          {emprestimosPendentes.length > 0 ? emprestimosPendentes.map(emp => (
            <li key={emp.id}>"{emp.livro.titulo}" - Devolver até {new Date(emp.dataDevolucaoPrevista).toLocaleDateString()}</li>
          )) : <p>Você não possui empréstimos pendentes.</p>}
        </ul>
      </div>

      <div className="dashboard-card">
        <h3>Próximos Eventos da Loja</h3>
        <ul>
          {proximosEventos.length > 0 ? proximosEventos.map(evento => (
            <li key={evento.id}>{evento.titulo} - {new Date(evento.dataHoraInicio).toLocaleDateString()}</li>
          )) : <p>Nenhum evento agendado para os próximos dias.</p>}
        </ul>
      </div>
    </div>
  );
};

export default MemberDashboard;
