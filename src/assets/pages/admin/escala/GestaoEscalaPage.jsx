import React, { useState, useEffect } from "react";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getEscala,
  updateOrdemEscala,
} from "../../../../services/escalaService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";
import "../../../../assets/styles/TableStyles.css"; // Reutiliza estilos de tabela
import "./GestaoEscalaPage.css"; // CSS específico para esta página

const GestaoEscalaPage = () => {
  // Busca os dados iniciais com o hook
  const {
    data: fetchedEscala,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getEscala);

  // Mantém uma cópia local da escala para manipulação (reordenação)
  const [escala, setEscala] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Sincroniza o estado local com os dados buscados da API
  useEffect(() => {
    if (fetchedEscala) {
      setEscala(fetchedEscala);
    }
  }, [fetchedEscala]);

  // Função para mover um item para cima na lista
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newEscala = [...escala];
    const item = newEscala.splice(index, 1)[0];
    newEscala.splice(index - 1, 0, item);
    setEscala(newEscala);
  };

  // Função para mover um item para baixo na lista
  const handleMoveDown = (index) => {
    if (index === escala.length - 1) return;
    const newEscala = [...escala];
    const item = newEscala.splice(index, 1)[0];
    newEscala.splice(index + 1, 0, item);
    setEscala(newEscala);
  };

  // Função para salvar a nova ordem no backend
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const novaOrdemIds = escala.map((item) => item.membro.id);
    try {
      await updateOrdemEscala(novaOrdemIds);
      showSuccessToast("Ordem da escala salva com sucesso!");
      refetch(); // Busca os dados novamente para confirmar
    } catch (err) {
      showErrorToast("Falha ao salvar a nova ordem da escala.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão da Escala de Jantares</h1>
        <button
          onClick={handleSaveChanges}
          className="btn-action btn-approve"
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : "Salvar Nova Ordem"}
        </button>
      </div>

      {isLoading && <p>Carregando escala...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="table-responsive">
        <table className="custom-table escala-table">
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Nome do Irmão</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {escala.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.membro.NomeCompleto}</td>
                <td>
                  <span className={`status-badge status-${item.status}`}>
                    {item.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === escala.length - 1}
                  >
                    ↓
                  </button>
                  {/* Botão de alterar status pode ser adicionado aqui */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestaoEscalaPage;
