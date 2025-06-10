import React, { useState, useEffect, useCallback } from 'react';
import { getPatrimonios, createPatrimonio, updatePatrimonio } from '../../../services/patrimonioService';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/modal/Modal';
import PatrimonioForm from './PatrimonioForm';
import '../../styles/TableStyles.css'; // Reutilizando CSS

const PatrimonioPage = () => {
  const [itens, setItens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { user } = useAuth();

  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchItens = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPatrimonios();
      setItens(response.data);
    } catch (err) {
      setError('Falha ao carregar o inventário de património.');
      console.error("Erro ao carregar o inventário de património:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchItens(); }, [fetchItens]);

  const handleSave = async (formData) => {
    try {
      if (currentItem) {
        await updatePatrimonio(currentItem.id, formData);
      } else {
        await createPatrimonio(formData);
      }
      fetchItens();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o item.');
    }
  };
  
  const openCreateModal = () => { setCurrentItem(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setCurrentItem(item); setIsModalOpen(true); };

  if (isLoading) return <div className="member-list-container">A carregar...</div>;

  return (
    <div className="member-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Inventário de Património</h1>
        {canManage && <button onClick={openCreateModal} className="btn-action btn-approve">Adicionar Item</button>}
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nome do Item</th>
              <th>Data de Aquisição</th>
              <th>Valor (R$)</th>
              <th>Estado</th>
              {canManage && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {itens.map(item => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{new Date(item.dataAquisicao).toLocaleDateString()}</td>
                <td>{parseFloat(item.valorAquisicao).toFixed(2)}</td>
                <td>{item.estadoConservacao}</td>
                {canManage && (
                  <td className="actions-cell">
                    <button className="btn-action btn-edit" onClick={() => openEditModal(item)}>Editar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Editar Item' : 'Novo Item de Património'}>
        <PatrimonioForm itemToEdit={currentItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default PatrimonioPage;
