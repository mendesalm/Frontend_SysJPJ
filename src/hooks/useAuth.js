import { useContext } from 'react';
// Importa o AuthContext diretamente do ficheiro de contexto
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Hook customizado para aceder ao AuthContext.
 * Esta abordagem centraliza o acesso ao contexto e mantém os ficheiros de componentes limpos.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};