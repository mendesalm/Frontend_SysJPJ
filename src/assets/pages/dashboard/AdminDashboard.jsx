import React from "react";
import CountUp from "react-countup"; // Certifique-se que esta biblioteca está instalada

const AdminDashboard = ({ data }) => {
  // Valores padrão para evitar erros se os dados não vierem completos
  const {
    resumoFinanceiro = {},
    totalMembros = 0,
    proximosAniversariantes = [],
    proximosEventos = [],
  } = data || {};

  const stats = [
    { label: "Total de Membros Ativos", value: totalMembros },
    {
      label: "Saldo do Mês (Tesouro)",
      value: resumoFinanceiro.saldo || 0,
      prefix: "R$ ",
    },
    { label: "Próximos Eventos", value: proximosEventos.length },
    {
      label: "Próximos Aniversariantes",
      value: proximosAniversariantes.length,
    },
  ];

  return (
    <div className="admin-dashboard">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <h3>{stat.label}</h3>
          <p className="stat-value">
            <CountUp
              start={0}
              end={stat.value}
              duration={2.5}
              separator="."
              decimal=","
              prefix={stat.prefix || ""}
            />
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
