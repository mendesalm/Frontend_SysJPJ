import React from "react";

const MemberDashboard = ({ data }) => {
  const { emprestimosPendentes = [] } = data || {};

  return (
    <div className="member-dashboard" style={{ flexShrink: 0 }}>
      <h2>Bem-vindo ao seu Painel</h2>
      <div className="stat-card">
        <h3>Empréstimos Pendentes</h3>
        <p className="stat-value">{emprestimosPendentes.length}</p>
        {emprestimosPendentes.length > 0 && (
          <ul
            style={{
              fontSize: "0.9rem",
              listStyle: "none",
              padding: 0,
              marginTop: "1rem",
            }}
          >
            {emprestimosPendentes.map((e) => (
              <li key={e.id}>- {e.livro.titulo}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
