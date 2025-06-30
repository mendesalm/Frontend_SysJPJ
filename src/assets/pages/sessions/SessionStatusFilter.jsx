
import React from 'react';

const SessionStatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = ['Agendada', 'Realizada', 'Cancelada'];

  return (
    <div className="session-status-filter">
      {statuses.map(status => (
        <button
          key={status}
          className={`btn-filter ${selectedStatus === status ? 'active' : ''}`}
          onClick={() => onStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default SessionStatusFilter;
