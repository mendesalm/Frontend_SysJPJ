import React, { useState, useEffect, useCallback } from 'react';
import { getPermissoes, updatePermissao, deletePermissao } from '../../../../services/permissionService';
import { getAllCargos } from '../../../../services/cargoService';
import Modal from '../../../../components/modal/Modal';
import '../../../../assets/styles/TableStyles.css'; // Importa o novo estilo de tabela
import '../../../../assets/styles/FormStyles.css'; // Importa o estilo para o formulário no modal

const TODAS_AS_CREDENCIAS = ['Webmaster', 'Diretoria', 'Membro'];

const PermissionsPage = () => {
  const [permissoes, setPermissoes] = useState([]);
  const [todosOsCargos, setTodosOsCargos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [featureEmEdicao, setFeatureEmEdicao] = useState(null);

  const [newPermission, setNewPermission] = useState({
    nomeFuncionalidade: '',
    descricao: '',
  });

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');
      const [permissoesResponse, cargosResponse] = await Promise.all([
        getPermissoes(),
        getAllCargos(),
      ]);
      setPermissoes(permissoesResponse.data);
      setTodosOsCargos(cargosResponse.data.map(c => c.NomeCargo).sort());
    } catch (err) {
      console.error("Erro ao buscar dados iniciais:", err);
      setError('Falha ao carregar as configurações. Verifique a consola para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleCredencialChange = (nomeFuncionalidade, credencial, isChecked) => {
    setPermissoes(permissoesAtuais =>
      permissoesAtuais.map(p =>
        p.nomeFuncionalidade === nomeFuncionalidade
          ? { ...p, credenciaisPermitidas: isChecked
              ? [...new Set([...(p.credenciaisPermitidas || []), credencial])]
              : (p.credenciaisPermitidas || []).filter(c => c !== credencial)
            }
          : p
      )
    );
  };
  
  const handleSave = async (permissao) => {
    try {
      setError('');
      setSuccessMessage('');
      await updatePermissao(permissao);
      setSuccessMessage(`Permissões para "${permissao.nomeFuncionalidade}" salvas com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error("Erro ao salvar permissão:", err);
      setError(`Falha ao salvar permissão para "${permissao.nomeFuncionalidade}".`);
    }
  };

  const handleDelete = async (nomeFuncionalidade) => {
    if (window.confirm(`Tem a certeza que deseja deletar a funcionalidade "${nomeFuncionalidade}"?`)) {
      try {
        setError('');
        setSuccessMessage('');
        await deletePermissao(nomeFuncionalidade);
        setSuccessMessage(`Funcionalidade "${nomeFuncionalidade}" deletada com sucesso!`);
        fetchInitialData();
      } catch (err) {
        console.error("Erro ao deletar permissão:", err);
        setError(err.response?.data?.message || `Falha ao deletar a funcionalidade "${nomeFuncionalidade}".`);
      }
    }
  };
  
  const openCargoModal = (funcionalidade) => {
    setFeatureEmEdicao(funcionalidade);
    setIsCargoModalOpen(true);
  };
  
  const handleCargoChangeInModal = (cargo, isChecked) => {
    setFeatureEmEdicao(featureAtual => ({
      ...featureAtual,
      cargosPermitidos: isChecked
        ? [...new Set([...(featureAtual.cargosPermitidos || []), cargo])]
        : (featureAtual.cargosPermitidos || []).filter(c => c !== cargo),
    }));
  };

  const handleSaveCargos = () => {
    setPermissoes(permissoesAtuais => 
        permissoesAtuais.map(p => p.nomeFuncionalidade === featureEmEdicao.nomeFuncionalidade ? featureEmEdicao : p)
    );
    setIsCargoModalOpen(false);
    setFeatureEmEdicao(null);
  };
  
  const handleNewPermissionChange = (e) => {
      const { name, value } = e.target;
      setNewPermission(prev => ({...prev, [name]: value}));
  };

  const handleCreatePermission = async (e) => {
      e.preventDefault();
      const dataToSend = {
          ...newPermission,
          credenciaisPermitidas: ['Webmaster'],
          cargosPermitidos: [],
      };
      
      try {
          await updatePermissao(dataToSend);
          setSuccessMessage(`Funcionalidade "${newPermission.nomeFuncionalidade}" criada com sucesso!`);
          setIsCreateModalOpen(false);
          setNewPermission({ nomeFuncionalidade: '', descricao: '' });
          fetchInitialData();
      } catch (err) {
          console.error("Erro ao criar nova permissão:", err);
          setError(err.response?.data?.message || 'Falha ao criar a nova funcionalidade.');
      }
  };

  if (isLoading) {
    return <div className="table-page-container">Carregando permissões...</div>;
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Permissões</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-action btn-approve">
          + Adicionar Funcionalidade
        </button>
      </div>

      {error && <p className="error-message" onClick={() => setError('')}>{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="table-responsive">
        <table className="custom-table">
            <thead>
                <tr>
                <th>Funcionalidade</th>
                {TODAS_AS_CREDENCIAS.map(credencial => ( <th key={credencial}>{credencial}</th> ))}
                <th>Cargos Permitidos</th>
                <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {permissoes.map(p => (
                <tr key={p.id}>
                    <td>
                      {p.nomeFuncionalidade}
                      <span style={{display: 'block', fontSize: '0.8rem', color: '#9CA3AF'}}>{p.descricao}</span>
                    </td>
                    {TODAS_AS_CREDENCIAS.map(credencial => (
                    <td key={credencial}>
                        <input
                        type="checkbox"
                        id={`${p.nomeFuncionalidade}-${credencial}`}
                        checked={(p.credenciaisPermitidas || []).includes(credencial)}
                        onChange={(e) => handleCredencialChange(p.nomeFuncionalidade, credencial, e.target.checked)}
                        disabled={credencial === 'Webmaster'}
                        />
                    </td>
                    ))}
                    <td className="cargo-cell">
                        <button onClick={() => openCargoModal(p)} className="btn-action">
                            Gerir ({ (p.cargosPermitidos || []).length })
                        </button>
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleSave(p)} className="btn-action btn-edit">Salvar</button>
                      <button onClick={() => handleDelete(p.nomeFuncionalidade)} className="btn-action btn-delete">Deletar</button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {isCargoModalOpen && (
        <Modal isOpen={isCargoModalOpen} onClose={() => setIsCargoModalOpen(false)} title={`Gerir Cargos para: ${featureEmEdicao?.nomeFuncionalidade}`}>
            <div className="cargo-modal-content">
                <p>Selecione os cargos que terão acesso a esta funcionalidade.</p>
                <div className="cargo-checkbox-list">
                    {todosOsCargos.map(cargo => (
                        <div key={cargo} className="cargo-checkbox-item">
                            <input 
                                type="checkbox"
                                id={`cargo-${featureEmEdicao?.nomeFuncionalidade}-${cargo}`}
                                checked={(featureEmEdicao?.cargosPermitidos || []).includes(cargo)}
                                onChange={(e) => handleCargoChangeInModal(cargo, e.target.checked)}
                            />
                            <label htmlFor={`cargo-${featureEmEdicao?.nomeFuncionalidade}-${cargo}`}>{cargo}</label>
                        </div>
                    ))}
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => setIsCargoModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    <button type="button" onClick={handleSaveCargos} className="btn btn-primary">Confirmar</button>
                </div>
            </div>
        </Modal>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Adicionar Nova Funcionalidade">
        <form onSubmit={handleCreatePermission} className="form-container">
            <div className="form-group">
                <label htmlFor="nomeFuncionalidade">Nome da Funcionalidade</label>
                <input 
                    type="text" 
                    id="nomeFuncionalidade"
                    name="nomeFuncionalidade"
                    value={newPermission.nomeFuncionalidade}
                    onChange={handleNewPermissionChange}
                    className="form-input"
                    placeholder="Ex: listarComissoes"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    value={newPermission.descricao}
                    onChange={handleNewPermissionChange}
                    rows="3"
                    className="form-textarea"
                    placeholder="Ex: Permite visualizar a lista de comissões."
                    required
                ></textarea>
            </div>
            <div className="form-actions">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Criar</button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default PermissionsPage;
