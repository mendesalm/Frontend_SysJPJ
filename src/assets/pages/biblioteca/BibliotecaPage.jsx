import React, { useState, useEffect, useCallback } from 'react';
import { getLivros, createLivro, updateLivro, registrarEmprestimo, registrarDevolucao, reservarLivro } from '../../../services/bibliotecaService';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/modal/Modal';
import LivroForm from './LivroForm';
import EmprestimoForm from './EmprestimoForm';
import '../../styles/TableStyles.css'


const BibliotecaPage = () => {
  const [livros, setLivros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const [isLivroModalOpen, setIsLivroModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [currentLivro, setCurrentLivro] = useState(null);

  const canManageLibrary = user?.credencialAcesso === 'Diretoria' || user?.credencialAcesso === 'Webmaster';

  const fetchLivros = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getLivros();
      setLivros(response.data);
    } catch (err) {
      console.error("Erro ao carregar o acervo:", err);
      setError('Falha ao carregar o acervo da biblioteca.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const handleSaveLivro = async (formData) => {
    try {
      if (currentLivro && currentLivro.id) {
        await updateLivro(currentLivro.id, formData);
      } else {
        await createLivro(formData);
      }
      fetchLivros();
      setIsLivroModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar o livro:", err);
      setError(err.response?.data?.message || 'Erro ao salvar o livro.'); 
    }
  };
  
  const handleRegistrarEmprestimo = async (emprestimoData) => {
    try {
      await registrarEmprestimo(emprestimoData);
      fetchLivros();
      setIsEmprestimoModalOpen(false);
    } catch (err) { 
      console.error("Erro ao registar empréstimo:", err);
      setError(err.response?.data?.message || 'Erro ao registar o empréstimo.'); 
    }
  };
  
  const handleRegistrarDevolucao = async (livro) => {
    const emprestimoAtivo = livro.historicoEmprestimos?.find(e => e.dataDevolucaoReal === null);
    if (!emprestimoAtivo) {
      alert("Erro: Não foi possível encontrar um empréstimo ativo para este livro.");
      return;
    }
    if(window.confirm(`Confirma a devolução do livro "${livro.titulo}"?`)){
      try {
        await registrarDevolucao(emprestimoAtivo.id);
        fetchLivros();
      } catch (err) {
        console.error("Erro ao registar devolução:", err);
        setError(err.response?.data?.message || 'Erro ao registar a devolução.');
      }
    }
  };

  const handleReservarLivro = async (livroId) => {
    if(window.confirm("Deseja entrar na fila de reserva para este livro?")) {
      try {
        await reservarLivro(livroId);
        alert("Reserva realizada com sucesso!");
        fetchLivros();
      } catch (err) {
        console.error("Erro ao realizar reserva:", err);
        setError(err.response?.data?.message || 'Não foi possível realizar a reserva.');
      }
    }
  };

  const openCreateModal = () => { setCurrentLivro(null); setIsLivroModalOpen(true); };
  const openEditModal = (livro) => { setCurrentLivro(livro); setIsLivroModalOpen(true); };
  const openEmprestimoModal = (livro) => { setCurrentLivro(livro); setIsEmprestimoModalOpen(true); };

  if (isLoading) return <div className="table-page-container">A carregar acervo...</div>;
  
  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Acervo da Biblioteca</h1>
        {canManageLibrary && (
          <button onClick={openCreateModal} className="btn-action btn-approve">+ Adicionar Livro</button>
        )}
      </div>

      {error && <p className="error-message" onClick={() => setError('')}>{error}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead><tr><th>Título</th><th>Autor(es)</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {livros.map(livro => (
              <tr key={livro.id}>
                <td>{livro.titulo}</td>
                <td>{livro.autores}</td>
                <td><span className={`status-badge status-${livro.status?.toLowerCase().replace(/ /g, '-') || 'disponível'}`}>{livro.status}</span></td>
                <td className="actions-cell">
                  {livro.status === 'Disponível' && canManageLibrary && (<button onClick={() => openEmprestimoModal(livro)} className="btn-action btn-edit">Emprestar</button>)}
                  {livro.status === 'Emprestado' && canManageLibrary && (<button onClick={() => handleRegistrarDevolucao(livro)} className="btn-action" style={{backgroundColor: '#ca8a04', color: '#1f2937'}}>Devolver</button>)}
                  {livro.status === 'Emprestado' && !canManageLibrary && (<button onClick={() => handleReservarLivro(livro.id)} className="btn-action">Reservar</button>)}
                  {canManageLibrary && (<button onClick={() => openEditModal(livro)} className="btn-action">Editar</button>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isLivroModalOpen} onClose={() => setIsLivroModalOpen(false)} title={currentLivro ? 'Editar Livro' : 'Adicionar Novo Livro'}>
        <LivroForm livroToEdit={currentLivro} onSave={handleSaveLivro} onCancel={() => setIsLivroModalOpen(false)} />
      </Modal>
      
      <Modal isOpen={isEmprestimoModalOpen} onClose={() => setIsEmprestimoModalOpen(false)} title="Registar Empréstimo">
        {currentLivro && <EmprestimoForm livro={currentLivro} onSave={handleRegistrarEmprestimo} onCancel={() => setIsEmprestimoModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default BibliotecaPage;
