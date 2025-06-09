import React, { useState, useEffect, useCallback } from 'react';
import { getLivros, createLivro, updateLivro, registrarEmprestimo, registrarDevolucao, reservarLivro } from '../../../services/bibliotecaService';
import { useAuth } from '../../../context/AuthContext';
import './BibliotecaPage.css';
import Modal from '../../../components/modal/Modal';
import LivroForm from './LivroForm';
import EmprestimoForm from './EmprestimoForm';

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
      // Assumindo que o backend, ao listar livros, inclui o histórico para sabermos o emprestimoId
      setLivros(response.data);
    } catch (err) {
      setError('Falha ao carregar o acervo da biblioteca.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLivros(); }, [fetchLivros]);

  const handleSaveLivro = async (formData) => {
    try {
      if (currentLivro && currentLivro.id) {
        await updateLivro(currentLivro.id, formData);
      } else {
        await createLivro(formData);
      }
      fetchLivros();
      setIsLivroModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Erro ao salvar o livro.'); }
  };
  
  const handleRegistrarEmprestimo = async (emprestimoData) => {
    try {
      await registrarEmprestimo(emprestimoData);
      fetchLivros();
      setIsEmprestimoModalOpen(false);
    } catch (err) { setError(err.response?.data?.message || 'Erro ao registar o empréstimo.'); }
  };
  
  const handleRegistrarDevolucao = async (livro) => {
    // Para a devolução funcionar, o backend precisa de retornar os empréstimos associados ao livro na rota principal.
    // Vamos assumir que a API envia `livro.historicoEmprestimos`.
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
        setError(err.response?.data?.message || 'Erro ao registar a devolução.');
      }
    }
  };

  const handleReservarLivro = async (livroId) => {
    if(window.confirm("Deseja entrar na fila de reserva para este livro? Você será notificado por e-mail quando ele estiver disponível.")) {
      try {
        await reservarLivro(livroId);
        alert("Reserva realizada com sucesso!");
        fetchLivros(); // Para atualizar o status, se o backend mudar algo
      } catch (err) {
        setError(err.response?.data?.message || 'Não foi possível realizar a reserva.');
      }
    }
  };

  const openCreateModal = () => { setCurrentLivro(null); setIsLivroModalOpen(true); };
  const openEditModal = (livro) => { setCurrentLivro(livro); setIsLivroModalOpen(true); };
  const openEmprestimoModal = (livro) => { setCurrentLivro(livro); setIsEmprestimoModalOpen(true); };

  if (isLoading) return <div className="biblioteca-container">A carregar acervo...</div>;
  
  return (
    <div className="biblioteca-container">
      <div className="biblioteca-header">
        <h1>Acervo da Biblioteca</h1>
        {canManageLibrary && (
          <button onClick={openCreateModal} className="btn-action btn-approve">Adicionar Novo Livro</button>
        )}
      </div>

      {error && <p className="error-message" onClick={() => setError('')}>{error}</p>}

      <div className="table-responsive">
        <table>
          <thead><tr><th>Título</th><th>Autor(es)</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {livros.map(livro => (
              <tr key={livro.id}>
                <td>{livro.titulo}</td>
                <td>{livro.autores}</td>
                <td><span className={`status-badge status-livro-${livro.status?.toLowerCase().replace(/ /g, '-')}`}>{livro.status}</span></td>
                <td className="actions-cell">
                  {livro.status === 'Disponível' && canManageLibrary && (<button onClick={() => openEmprestimoModal(livro)} className="btn-action btn-emprestar">Emprestar</button>)}
                  {livro.status === 'Emprestado' && canManageLibrary && (<button onClick={() => handleRegistrarDevolucao(livro)} className="btn-action btn-devolver">Devolver</button>)}
                  {livro.status === 'Emprestado' && !canManageLibrary && (<button onClick={() => handleReservarLivro(livro.id)} className="btn-action btn-reservar">Reservar</button>)}
                  {canManageLibrary && (<button onClick={() => openEditModal(livro)} className="btn-action btn-details">Editar</button>)}
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
