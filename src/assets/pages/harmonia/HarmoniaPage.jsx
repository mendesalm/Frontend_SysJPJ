import React, { useState, useEffect, useCallback } from 'react';
import { getHarmoniaItens, createHarmoniaItem, deleteHarmoniaItem } from '../../../services/harmoniaService';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/modal/Modal';
import HarmoniaForm from './HarmoniaForm';
import '../admin/members/MemberList.css'; // Reutiliza CSS da tabela

const HarmoniaPage = () => {
  const [itens, setItens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchItens = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getHarmoniaItens();
      setItens(response.data);
    } catch (err) {
      setError('Falha ao carregar o acervo de harmonia.');
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchItens(); }, [fetchItens]);

  const handleSave = async (formData) => {
    try {
      await createHarmoniaItem(formData);
      fetchItens();
      setIsModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Erro ao salvar o item.'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Tem a certeza que deseja apagar este item?')){
        try {
            await deleteHarmoniaItem(id);
            fetchItens();
        } catch(err) { setError(err.response?.data?.message || 'Erro ao apagar o item.'); }
    }
  }

  if (isLoading) return <div className="member-list-container">A carregar...</div>;

  return (
    <div className="member-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestão de Harmonia</h1>
        {canManage && <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve">Adicionar Áudio</button>}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="table-responsive">
        <table>
          <thead><tr><th>Título</th><th>Autor</th><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>
            {itens.map(item => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.autor}</td>
                <td>{item.categoria}</td>
                <td className="actions-cell">
                  {canManage && <button onClick={() => handleDelete(item.id)} className="btn-action" style={{backgroundColor: '#dc3545', color: 'white'}}>Apagar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Item de Harmonia">
        <HarmoniaForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default HarmoniaPage;
