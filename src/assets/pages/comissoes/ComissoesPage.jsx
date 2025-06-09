import React, { useState, useEffect, useCallback } from 'react';
import { getComissoes, createComissao } from '../../../services/comissoesService';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/modal/Modal';
import ComissaoForm from './ComissaoForm';
import './ComissoesPage.css';

const ComissoesPage = () => {
  const [comissoes, setComissoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  
  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchComissoes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getComissoes();
      setComissoes(response.data);
    } catch (err) {
      setError('Falha ao carregar as comissões.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchComissoes(); }, [fetchComissoes]);

  const handleSave = async (formData) => {
    try {
      await createComissao(formData);
      fetchComissoes();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar a comissão.');
    }
  };

  if (isLoading) return <div className="comissoes-container">A carregar...</div>;

  return (
    <div className="comissoes-container">
      <div className="comissoes-header">
        <h1>Comissões de Trabalho</h1>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve">Nova Comissão</button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <div className="comissoes-list">
        {comissoes.map(comissao => (
          <div key={comissao.id} className="comissao-card">
            <h3>{comissao.nome}</h3>
            <span className={`tipo-badge tipo-${comissao.tipo.toLowerCase()}`}>{comissao.tipo}</span>
            <p className="datas">
              {new Date(comissao.dataInicio).toLocaleDateString()} - {new Date(comissao.dataFim).toLocaleDateString()}
            </p>
            <div className="membros-list">
              <strong>Membros:</strong>
              <ul>
                {comissao.membros.map(membro => <li key={membro.id}>{membro.NomeCompleto}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Comissão">
        <ComissaoForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ComissoesPage;
