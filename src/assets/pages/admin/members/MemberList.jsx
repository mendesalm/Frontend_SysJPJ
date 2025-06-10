import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// CORREÇÃO: A importação de 'useAuth' foi removida pois não estava a ser utilizada.
import { getAllMembers, updateMember } from '../../../../services/memberService';
import '../../../../assets/styles/TableStyles.css'; // Importa os novos estilos de tabela

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // CORREÇÃO: A chamada ao hook `useAuth()` foi removida.
  
  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (err) {
      console.error("Erro ao buscar membros:", err);
      setError('Falha ao carregar a lista de membros.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // A permissão para aceder a esta página é agora inteiramente gerida pelo
    // componente `ProtectedRoute` e pelo middleware do backend.
    fetchMembers();
  }, [fetchMembers]);

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      await updateMember(memberId, { statusCadastro: newStatus });
      fetchMembers(); // Re-fetch para atualizar a lista
    } catch (err) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err);
      setError(`Não foi possível atualizar o status do membro.`);
    }
  };

  if (isLoading) {
    return <div className="table-page-container">A carregar lista de membros...</div>;
  }

  if (error) {
    return <div className="table-page-container error-message">{error}</div>;
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Membros</h1>
        <button 
          onClick={() => navigate('/admin/members/create')} 
          className="btn-action btn-approve"
        >
          + Novo Membro
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Email</th>
              <th>Status do Cadastro</th>
              <th>Credencial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.NomeCompleto}</td>
                <td>{member.Email}</td>
                <td>
                  <span className={`status-badge status-${member.statusCadastro?.toLowerCase() || 'pendente'}`}>
                    {member.statusCadastro}
                  </span>
                </td>
                <td>{member.credencialAcesso}</td>
                <td className="actions-cell">
                  {member.statusCadastro === 'Pendente' && (
                    <button
                      className="btn-action btn-approve"
                      onClick={() => handleUpdateStatus(member.id, 'Aprovado')}
                    >
                      Aprovar
                    </button>
                  )}
                  <button 
                    className="btn-action btn-edit" 
                    onClick={() => navigate(`/admin/members/edit/${member.id}`)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;
