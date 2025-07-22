import React from "react";
import CountUp from "react-countup";
import NoticesWidget from "./components/NoticesWidget";

const AdminDashboard = ({ data, avisosCount }) => {
  const { totalMembros = 0, proximosAniversariantes = [], proximosEventos = [] } = data || {};

  const stats = [
    { label: "Total de Membros Ativos", value: totalMembros },
    { label: "Próximos Eventos", value: proximosEventos.length },
    {
      label: "Próximos Aniversariantes",
      value: proximosAniversariantes.length,
    },
  ];

  return (
    <div className="admin-dashboard" style={{ flexShrink: 0 }}>
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
      <NoticesWidget count={avisosCount} />
    </div>
  );
};

export default AdminDashboard;
