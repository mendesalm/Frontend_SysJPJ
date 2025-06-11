import React, { useState, useEffect, useCallback } from 'react';
import { getEventos, createEvento, confirmarPresenca } from '../../../services/eventosService';
import { useAuth } from '../../../hooks/useAuth';
import Modal from '../../../components/modal/Modal';
import EventoForm from './EventoForm';
import './EventosPage.css';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  
  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getEventos();
      setEventos(response.data);
    } catch (err) {
      setError('Falha ao carregar os eventos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchEventos(); }, [fetchEventos]);

  const handleSave = async (formData) => {
    try {
      await createEvento(formData);
      fetchEventos();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar o evento.');
    }
  };
  
  const handleConfirmarPresenca = async (eventoId) => {
    try {
      await confirmarPresenca(eventoId, { statusConfirmacao: 'Confirmado' });
      alert('Presença confirmada com sucesso!');
      // TODO: Atualizar a UI para mostrar que a presença foi confirmada
    } catch (err) {
       setError(err.response?.data?.message || 'Erro ao confirmar presença.');
    }
  }

  if (isLoading) return <div className="eventos-container">A carregar...</div>;

  return (
    <div className="eventos-container">
      <div className="eventos-header">
        <h1>Calendário de Eventos</h1>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} className="btn-action btn-approve">Novo Evento</button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <div className="eventos-list">
        {eventos.map(evento => (
          <div key={evento.id} className="evento-card">
            <div className="evento-date">
              <span className="evento-day">{new Date(evento.dataHoraInicio).getDate()}</span>
              <span className="evento-month">{new Date(evento.dataHoraInicio).toLocaleString('pt-BR', { month: 'short' })}</span>
            </div>
            <div className="evento-details">
              <h3>{evento.titulo}</h3>
              <p className="evento-time-local">
                {new Date(evento.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {' @ '}
                {evento.local}
              </p>
              <p className="evento-tipo">{evento.tipo}</p>
            </div>
            <div className="evento-actions">
               <button onClick={() => handleConfirmarPresenca(evento.id)} className="btn-confirmar">Confirmar Presença</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Evento">
        <EventoForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default EventosPage;
