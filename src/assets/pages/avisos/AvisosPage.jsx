import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAllAvisos, createAviso, updateAviso, deleteAviso } from '../../../services/avisoService';
import Modal from '../../../components/modal/Modal';
import AvisoForm from './AvisoForm';
import './AvisosPage.css';

const AvisosPage = () => {
  const [avisos, setAvisos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAviso, setCurrentAviso] = useState(null);

  const { user } = useAuth();

  const fetchAvisos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllAvisos();
      setAvisos(response.data);
    } catch (err) {
      // CORREÇÃO: Utilizando a variável 'err' para logging.
      console.error("Erro ao buscar avisos:", err);
      setError('Falha ao carregar o mural de avisos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvisos();
  }, [fetchAvisos]);
  
  const openModalToCreate = () => {
    setCurrentAviso(null);
    setIsModalOpen(true);
  };
  
  const openModalToEdit = (aviso) => {
    setCurrentAviso(aviso);
    setIsModalOpen(true);
  };

  const handleSaveAviso = async (formData) => {
    try {
      if (currentAviso) {
        await updateAviso(currentAviso.id, formData);
      } else {
        await createAviso(formData);
      }
      fetchAvisos();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar aviso:", err);
      setError("Não foi possível salvar o aviso.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza que deseja apagar este aviso?')) {
      try {
        await deleteAviso(id);
        fetchAvisos();
      } catch (err) {
        // CORREÇÃO: Utilizando a variável 'err' para logging.
        console.error("Erro ao apagar aviso:", err);
        setError('Não foi possível apagar o aviso.');
      }
    }
  };
  
  const canManage = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  if (isLoading) return <div className="avisos-container">A carregar avisos...</div>;

  return (
    <div className="avisos-container">
      <div className="avisos-header">
        <h1>Mural de Avisos</h1>
        {canManage && (
          <button onClick={openModalToCreate} className="btn-novo-aviso">Criar Novo Aviso</button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="avisos-list">
        {avisos.map(aviso => (
          <div key={aviso.id} className={`aviso-card ${aviso.fixado ? 'fixado' : ''}`}>
            {aviso.fixado && <span className="aviso-fixado-badge">📌 Fixo</span>}
            <div className="aviso-card-header">
              <h2>{aviso.titulo}</h2>
              {canManage && (
                <div className="aviso-actions">
                  <button onClick={() => openModalToEdit(aviso)} className="btn-action btn-edit">Editar</button>
                  <button onClick={() => handleDelete(aviso.id)} className="btn-action btn-delete">Apagar</button>
                </div>
              )}
            </div>
            <p className="aviso-conteudo">{aviso.conteudo}</p>
            <div className="aviso-footer">
              <span>Por: {aviso.autor?.NomeCompleto || 'Sistema'}</span>
              <span>Publicado: {new Date(aviso.createdAt).toLocaleDateString()}</span>
              {aviso.dataExpiracao && <span>Expira em: {new Date(aviso.dataExpiracao).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentAviso ? 'Editar Aviso' : 'Criar Novo Aviso'}
      >
        <AvisoForm 
          avisoToEdit={currentAviso}
          onSave={handleSaveAviso}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AvisosPage;
