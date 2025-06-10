import React, { useState, useEffect, useCallback } from 'react';
import { getLancamentos, createLancamento } from '../../../services/financeService';
import Modal from '../../../components/modal/Modal';
import LancamentoForm from './LancamentoForm';
import '../../styles/TableStyles.css';


const LancamentosPage = () => {
  const [lancamentos, setLancamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para os filtros
  const [filter, setFilter] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  });

  const fetchLancamentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getLancamentos(filter);
      setLancamentos(response.data);
    } catch (err) {
      setError('Falha ao carregar os lançamentos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLancamentos();
  }, [fetchLancamentos]);

  const handleSave = async (formData) => {
    try {
      await createLancamento(formData);
      fetchLancamentos();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o lançamento.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="member-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Lançamentos Financeiros</h1>
        <div>
          <select name="mes" value={filter.mes} onChange={handleFilterChange} style={{marginRight: '10px', padding: '8px'}}>
            {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <input type="number" name="ano" value={filter.ano} onChange={handleFilterChange} style={{padding: '8px', width: '100px'}}/>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve" style={{height: 'fit-content'}}>Novo Lançamento</button>
      </div>
      
      {error && <p className="error-message" onClick={() => setError('')} style={{cursor: 'pointer'}}>{error}</p>}
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Conta</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4">A carregar...</td></tr>
            ) : lancamentos.map(lanc => (
              <tr key={lanc.id}>
                <td>{new Date(lanc.dataLancamento).toLocaleDateString()}</td>
                <td>{lanc.descricao}</td>
                <td>{lanc.conta?.nome}</td>
                <td style={{color: lanc.conta?.tipo === 'Receita' ? 'green' : 'red'}}>
                  {lanc.conta?.tipo === 'Despesa' && '- '}
                  {parseFloat(lanc.valor).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lançamento">
        <LancamentoForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LancamentosPage;
