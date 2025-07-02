import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useDebounce from '../../hooks/useDebounce';
import '../../assets/styles/FormStyles.css'; // Reusing form styles

const PatrimonioFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    nome: '',
    estadoConservacao: '',
  });

  const debouncedFilters = useDebounce(filters, 500); // Debounce for 500ms

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      nome: '',
      estadoConservacao: '',
    });
  };

  return (
    <div className="form-container" style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--cor-borda-input)', borderRadius: '8px' }}>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr auto', alignItems: 'flex-end' }}>
        <div className="form-group">
          <label htmlFor="filterNome">Filtrar por Nome</label>
          <input
            id="filterNome"
            type="text"
            name="nome"
            value={filters.nome}
            onChange={handleChange}
            className="form-input"
            placeholder="Nome do item..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="filterEstadoConservacao">Filtrar por Estado</label>
          <select
            id="filterEstadoConservacao"
            name="estadoConservacao"
            value={filters.estadoConservacao}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Todos</option>
            <option value="Novo">Novo</option>
            <option value="Bom">Bom</option>
            <option value="Regular">Regular</option>
            <option value="Inservível">Inservível</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="btn btn-secondary"
          style={{ height: 'fit-content', padding: '10px 15px' }}
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

PatrimonioFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default PatrimonioFilter;
