import React, { useCallback, useEffect, useState, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../../../hooks/useAuth";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getEscala,
  updateOrdemEscala,
  updateStatusEscala,
  inicializarEscala,
  adicionarMembroEscala,
  removerMembroEscala,
} from "../../../../services/escalaService";
import { getAllMembers } from "../../../../services/memberService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../utils/notifications";
import "../../../../assets/styles/TableStyles.css";
import "./GestaoEscalaPage.css";
import { FaTrash } from "react-icons/fa";

const ItemType = "ESCALA_ITEM";

const EscalaRow = ({
  item,
  index,
  moveRow,
  onStatusChange,
  onRemove,
  canManage,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: canManage,
  });

  drag(drop(ref));

  const nomeCompleto =
    item.membro?.NomeCompleto || item.NomeCompleto || "Membro não encontrado";
  const statusSeguro = item.status || "ativo";

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="escala-row"
    >
      <td className="drag-handle">{canManage ? "☰" : ""}</td>
      <td>{index + 1}º</td>
      <td>{nomeCompleto}</td>
      <td>
        <select
          value={statusSeguro}
          onChange={(e) => onStatusChange(item.id, e.target.value)}
          disabled={!canManage}
          className={`status-select status-${statusSeguro.toLowerCase()}`}
        >
          <option value="Ativo">Ativo</option>
          <option value="Pausado">Pausado</option>
        </select>
      </td>
      <td className="actions-cell">
        {canManage && (
          <button
            onClick={() => onRemove(item.id)}
            className="btn-action btn-delete"
            title="Remover da Escala"
          >
            <FaTrash />
          </button>
        )}
      </td>
    </tr>
  );
};

const GestaoEscalaPage = () => {
  const { user } = useAuth();
  const {
    data: fetchedData,
    isLoading,
    error,
    refetch,
  } = useDataFetching(getEscala);

  const [escala, setEscala] = useState([]);
  const [membros, setMembros] = useState([]);
  const [primeiroMembroId, setPrimeiroMembroId] = useState("");
  const [membroParaAdicionarId, setMembroParaAdicionarId] = useState("");

  const canManage = useMemo(
    () =>
      user?.permissoes?.includes("gerenciarEscalaJantar") ||
      user?.credencialAcesso === "Webmaster",
    [user]
  );

  useEffect(() => {
    if (canManage) {
      getAllMembers({ status: "Ativo", limit: 999 })
        .then((response) => setMembros(response.data || []))
        .catch((err) => console.error("Erro ao buscar membros:", err));
    }
  }, [canManage]);

  useEffect(() => {
    if (fetchedData) {
      setEscala(fetchedData);
    }
  }, [fetchedData]);

  const membrosForaDaEscala = useMemo(() => {
    if (!escala || !membros) return [];
    const idsNaEscala = new Set(
      escala.map((item) => item.membro?.id).filter(Boolean)
    );
    return membros.filter((membro) => !idsNaEscala.has(membro.id));
  }, [membros, escala]);

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setEscala((prevEscala) => {
      const newEscala = [...prevEscala];
      const [draggedItem] = newEscala.splice(dragIndex, 1);
      newEscala.splice(hoverIndex, 0, draggedItem);
      return newEscala;
    });
  }, []);

  const handleSaveChanges = async () => {
    if (!escala) return;
    const novaOrdemIds = escala.map((item) => item.id);
    try {
      await updateOrdemEscala(novaOrdemIds);
      showSuccessToast("Ordem da escala salva com sucesso!");
      refetch();
    } catch (err) {
      console.error("Erro ao salvar ordem da escala:", err);
      showErrorToast("Falha ao salvar a nova ordem da escala.");
    }
  };

  const handleStatusChange = async (escalaId, newStatus) => {
    const originalEscala = [...escala];
    setEscala(
      originalEscala.map((item) =>
        item.id === escalaId ? { ...item, status: newStatus } : item
      )
    );
    try {
      await updateStatusEscala(escalaId, newStatus);
      showSuccessToast("Status do membro na escala foi atualizado.");
    } catch (err) {
      console.error("Erro ao mudar status na escala:", err);
      showErrorToast("Falha ao atualizar o status.");
      setEscala(originalEscala);
    }
  };

  const handleInitialize = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja inicializar a escala? Isso irá limpar a ordem atual e criar uma nova com todos os membros ativos."
      )
    ) {
      try {
        await inicializarEscala(primeiroMembroId);
        showSuccessToast("Escala inicializada com sucesso!");
        refetch();
      } catch (err) {
        console.error("Erro ao inicializar escala:", err);
        showErrorToast("Falha ao inicializar a escala.");
      }
    }
  };

  const handleAddMember = async () => {
    if (!membroParaAdicionarId) {
      showErrorToast("Por favor, selecione um membro para adicionar.");
      return;
    }
    try {
      await adicionarMembroEscala(membroParaAdicionarId);
      showSuccessToast("Membro adicionado ao final da escala!");
      setMembroParaAdicionarId("");
      refetch();
    } catch (err) {
      console.error("Erro ao adicionar membro à escala:", err);
      showErrorToast("Falha ao adicionar membro à escala.");
    }
  };

  const handleRemoveMember = async (escalaId) => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este membro permanentemente da escala?"
      )
    ) {
      try {
        await removerMembroEscala(escalaId);
        showSuccessToast("Membro removido da escala!");
        refetch();
      } catch (err) {
        console.error("Erro ao remover membro da escala:", err);
        showErrorToast("Falha ao remover membro da escala.");
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-page-container gestao-escala-page">
        <div className="table-header">
          <h1>Gestão da Escala de Jantares</h1>
        </div>

        <p className="page-description">
          Utilize as seções abaixo para gerenciar a escala. Arraste e solte os
          membros na tabela para reordenar a fila.
        </p>

        <div className="escala-page-layout">
          <main className="escala-main-content">
            <div className="table-header">
              <h2>Ordem Atual da Fila</h2>
              {canManage && (
                <button onClick={handleSaveChanges} className="btn btn-primary">
                  Salvar Nova Ordem
                </button>
              )}
            </div>

            <div className="table-responsive">
              <table className="custom-table escala-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}></th>
                    <th style={{ width: "80px" }}>Ordem</th>
                    <th>Nome do Irmão</th>
                    <th style={{ width: "200px" }}>Status na Escala</th>
                    <th style={{ width: "80px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        Carregando escala...
                      </td>
                    </tr>
                  )}
                  {error && (
                    <tr>
                      <td colSpan="5" className="error-message">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!isLoading && escala?.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-table-message">
                        A escala de jantares está vazia.
                        {canManage &&
                          " Use as ferramentas à direita para inicializar uma nova escala."}
                      </td>
                    </tr>
                  )}
                  {escala?.map((item, index) => (
                    <EscalaRow
                      key={item.id}
                      item={item}
                      index={index}
                      moveRow={moveRow}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemoveMember}
                      canManage={canManage}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </main>

          {canManage && (
            <aside className="escala-actions-sidebar">
              <div className="card initialization-section">
                <h4>Inicializar ou Reiniciar Escala</h4>
                <p>Cria uma nova escala com todos os membros ativos.</p>
                <div className="form-group">
                  <label htmlFor="primeiro-membro">
                    Opcional: Primeiro da fila
                  </label>
                  <select
                    id="primeiro-membro"
                    value={primeiroMembroId}
                    onChange={(e) => setPrimeiroMembroId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Ordem alfabética padrão</option>
                    {membros.map((membro) => (
                      <option key={membro.id} value={membro.id}>
                        {membro.NomeCompleto}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={handleInitialize} className="btn btn-warning">
                  Inicializar Escala
                </button>
              </div>

              <div className="card add-member-section">
                <h4>Adicionar Membro à Escala</h4>
                <p>
                  Adiciona um membro que não está na escala ao final da fila.
                </p>
                <div className="form-group">
                  <label htmlFor="add-member-select">Selecione um membro</label>
                  <div className="form-group-inline">
                    <select
                      id="add-member-select"
                      value={membroParaAdicionarId}
                      onChange={(e) => setMembroParaAdicionarId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Selecione...</option>
                      {membrosForaDaEscala.map((membro) => (
                        <option key={membro.id} value={membro.id}>
                          {membro.NomeCompleto}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddMember}
                      className="btn btn-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default GestaoEscalaPage;
