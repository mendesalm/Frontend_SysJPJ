import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { setNextBalaustreNumber } from '../../../../services/balaustreService';
import { notifications } from '../../../../utils/notifications';
import './BalaustreSettings.css';

const BalaustreSettings = () => {
  const { hasPermission } = useAuth();
  const [nextNumber, setNextNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasPermission('gerenciarConfiguracoes')) {
      notifications.error('Você não tem permissão para realizar esta ação.');
      return;
    }

    setLoading(true);
    try {
      await setNextBalaustreNumber(parseInt(nextNumber, 10));
      notifications.success('Número do próximo balaústre atualizado com sucesso!');
      setNextNumber('');
    } catch (error) {
      notifications.error('Erro ao atualizar o número do próximo balaústre: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="balaustre-settings-container">
      <h2>Configurar Número do Próximo Balaústre</h2>
      <p>Defina o número inicial para o próximo balaústre a ser gerado automaticamente.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nextNumber">Próximo Número:</label>
          <input
            type="number"
            id="nextNumber"
            value={nextNumber}
            onChange={(e) => setNextNumber(e.target.value)}
            required
            min="1"
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading || !hasPermission('gerenciarConfiguracoes')}>
          {loading ? 'Salvando...' : 'Salvar Configuração'}
        </button>
      </form>
    </div>
  );
};

export default BalaustreSettings;
