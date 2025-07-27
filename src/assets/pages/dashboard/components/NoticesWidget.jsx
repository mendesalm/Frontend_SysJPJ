
import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

const NoticesWidget = ({ count }) => {
  return (
    <Link to="/mural-de-avisos" className="stat-card-link">
      <div className="stat-card">
        <h3>Avisos</h3>
        <p className="stat-value">
          <CountUp end={count} duration={2} />
        </p>
        <span className="link-details">Ver todos</span>
      </div>
    </Link>
  );
};

export default NoticesWidget;
