import React, { useState, useEffect, useCallback } from 'react';
import { getSessions, createSession } from '../../../services/sessionService';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../../components/modal/Modal';
import SessionForm from './SessionForm';
import './SessionsPage.css';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const canManageSessions = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getSessions();
      setSessions(response.data);
    } catch (err) {
      setError('Falha ao carregar as sessões.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleSaveSession = async (formData) => {
    try {
      await createSession(formData);
      fetchSessions(); // Atualiza a lista
      setIsModalOpen(false); // Fecha o modal
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registar a sessão.');
    }
  };

  if (isLoading) return <div className="sessions-container">A carregar sessões...</div>;
  if (error) return <div className="sessions-container error-message">{error}</div>;

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h1>Sessões Maçónicas</h1>
        {canManageSessions && (
          <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve">Registar Nova Sessão</button>
        )}
      </div>
      
      {error && <p className="error-message" onClick={() => setError('')}>{error}</p>}

      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            <div className="session-card-header">
              <h3>{session.tipoSessao} de {session.subtipoSessao}</h3>
              <span className="session-date">{new Date(session.dataSessao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
            </div>
            <div className="session-card-body">
              <p><strong>Presentes:</strong> {session.presentes?.length || 0} Obreiros</p>
              <p><strong>Visitantes:</strong> {session.visitantes?.length || 0}</p>
              {session.ata ? (<a href={`/uploads/${session.ata.path}`} target="_blank" rel="noreferrer">Ver Ata (Nº {session.ata.numero}/{session.ata.ano})</a>) : (<p>Ata não disponível</p>)}
            </div>
            <div className="session-card-footer">{canManageSessions && (<button className="btn-action btn-details">Ver Detalhes</button>)}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registar Nova Sessão Maçónica">
        <SessionForm onSave={handleSaveSession} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default SessionsPage;
