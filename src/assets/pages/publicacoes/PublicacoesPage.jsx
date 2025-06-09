import React, { useState, useEffect, useCallback } from 'react';
import { getPublicacoes, createPublicacao } from '../../../services/publicacaoService';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/modal/Modal';
import PublicacaoForm from './PublicacaoForm';
import './PublicacoesPage.css';

const PublicacoesPage = () => {
  const [publicacoes, setPublicacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  
  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchPublicacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPublicacoes();
      setPublicacoes(response.data);
    } catch (err) {
      setError('Falha ao carregar as publicações.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicacoes();
  }, [fetchPublicacoes]);

  const handleSave = async (formData) => {
    try {
      await createPublicacao(formData);
      fetchPublicacoes();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar a publicação.');
    }
  };

  if (isLoading) return <div className="publicacoes-container">A carregar...</div>;

  return (
    <div className="publicacoes-container">
      <div className="publicacoes-header">
        <h1>Publicações e Trabalhos</h1>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve">Nova Publicação</button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <div className="publicacoes-grid">
        {publicacoes.map(pub => (
          <div key={pub.id} className="publicacao-card">
            <div className="publicacao-icon">📄</div>
            <h3>{pub.nome}</h3>
            <p><strong>Tema:</strong> {pub.tema}</p>
            <p><strong>Autor:</strong> {pub.autorOuUploader?.NomeCompleto || 'N/A'}</p>
            {pub.grau && <p><strong>Grau:</strong> {pub.grau}</p>}
            <a href={`http://localhost:3001/${pub.path}`} target="_blank" rel="noreferrer" className="btn-download">
              Ver / Baixar
            </a>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Publicação">
        <PublicacaoForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default PublicacoesPage;
