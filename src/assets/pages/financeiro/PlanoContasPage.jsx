import React, { useState, useEffect, useCallback } from 'react';
import { getContas, createConta, updateConta, deleteConta } from '../../../services/financeService';
import Modal from '../../../components/modal/Modal';
import ContaForm from './ContaForm';
// Reutilizaremos o CSS da lista de membros para a tabela
import '../admin/members/MemberList.css';

const PlanoContasPage = () => {
  const [contas, setContas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConta, setCurrentConta] = useState(null);

  const fetchContas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getContas();
      setContas(response.data);
    } catch (err) {
      setError('Falha ao carregar o plano de contas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  const handleSave = async (formData) => {
    try {
      if (currentConta) {
        await updateConta(currentConta.id, formData);
      } else {
        await createConta(formData);
      }
      fetchContas();
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao salvar a conta.';
      setError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Atenção: só é possível apagar contas que não possuem lançamentos. Deseja continuar?')) {
      try {
        await deleteConta(id);
        fetchContas();
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Não foi possível apagar a conta.';
        setError(errorMsg);
      }
    }
  };

  const openModalToCreate = () => {
    setCurrentConta(null);
    setIsModalOpen(true);
  };

  const openModalToEdit = (conta) => {
    setCurrentConta(conta);
    setIsModalOpen(true);
  };
  
  if (isLoading) return <div className="member-list-container">A carregar...</div>;

  return (
    <div className="member-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Plano de Contas</h1>
        <button onClick={openModalToCreate} className="btn-action btn-approve" style={{height: 'fit-content'}}>Nova Conta</button>
      </div>
      
      {error && <p className="error-message" onClick={() => setError('')} style={{cursor: 'pointer'}}>{error}</p>}
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nome da Conta</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map(conta => (
              <tr key={conta.id}>
                <td>{conta.nome}</td>
                <td>
                  <span className={`status-badge ${conta.tipo === 'Receita' ? 'status-aprovado' : 'status-rejeitado'}`}>
                    {conta.tipo}
                  </span>
                </td>
                <td>{conta.descricao}</td>
                <td className="actions-cell">
                  <button className="btn-action btn-edit" onClick={() => openModalToEdit(conta)}>Editar</button>
                  <button className="btn-action" style={{backgroundColor: '#dc3545', color: 'white'}} onClick={() => handleDelete(conta.id)}>Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentConta ? 'Editar Conta' : 'Criar Nova Conta'}
      >
        <ContaForm 
          contaToEdit={currentConta}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanoContasPage;
