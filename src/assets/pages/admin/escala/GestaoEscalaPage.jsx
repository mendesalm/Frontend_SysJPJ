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
  swapEscalaOrder,
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
      className={`escala-row ${item.foiResponsavelNoCiclo ? "escala-cumprido" : ""}`}
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
  const [ordemFoiAlterada, setOrdemFoiAlterada] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedMember1, setSelectedMember1] = useState("");
  const [selectedMember2, setSelectedMember2] = useState("");

  const canManage = useMemo(
    () =>
      user?.permissoes?.includes("gerenciarEscalaJantar") ||
      user?.credencialAcesso === "Webmaster",
    [user]
  );

  useEffect(() => {
    if (canManage) {
      getAllMembers({ status: "Ativo", limit: 999 })
        .then((response) =>
          setMembros(Array.isArray(response.data) ? response.data : [])
        )
        .catch((err) => console.error("Erro ao buscar membros:", err));
    }
  }, [canManage]);

  useEffect(() => {
    if (fetchedData) {
      // Sort by 'ordem' field
      const sortedEscala = [...fetchedData].sort((a, b) => a.ordem - b.ordem);
      setEscala(sortedEscala);
      setOrdemFoiAlterada(false);
    }
  }, [fetchedData]);

  const membrosForaDaEscala = useMemo(() => {
    if (!escala || !membros) return [];
    const idsNaEscala = new Set(
      escala.map((item) => item.membro?.id).filter(Boolean)
    );
    return membros.filter((membro) => !idsNaEscala.has(membro.id));
  }, [membros, escala]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      setEscala((prevEscala) => {
        const newEscala = [...prevEscala];
        const [draggedItem] = newEscala.splice(dragIndex, 1);
        newEscala.splice(hoverIndex, 0, draggedItem);
        return newEscala;
      });
      setOrdemFoiAlterada(true);
    },
    []
  );

  const handleSaveChanges = async () => {
    if (!escala) return;
    const ordemIds = escala.map((item) => item.id);
    console.log("[GestaoEscalaPage] IDs para reordenar:", ordemIds); // Log
    try {
      await updateOrdemEscala(ordemIds);
      showSuccessToast("Ordem da escala salva com sucesso!");
      setOrdemFoiAlterada(false);
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

  const handleSwapOrder = async () => {
    if (!selectedMember1 || !selectedMember2) {
      showErrorToast("Por favor, selecione dois membros para trocar.");
      return;
    }
    if (selectedMember1 === selectedMember2) {
      showErrorToast("Por favor, selecione membros diferentes para trocar.");
      return;
    }

    try {
      await swapEscalaOrder(selectedMember1, selectedMember2);
      showSuccessToast("Ordem dos membros trocada com sucesso!");
      setShowSwapModal(false);
      setSelectedMember1("");
      setSelectedMember2("");
      refetch();
    } catch (err) {
      console.error("Erro ao trocar ordem:", err);
      showErrorToast("Falha ao trocar a ordem dos membros.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table-page-container">
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
            </div>

            <div className="table-responsive">
              <table className="custom-table">
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

              <div className="card swap-order-section">
                <h4>Trocar Ordem de Membros</h4>
                <p>Troca a posição de dois membros na escala.</p>
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="btn btn-primary"
                >
                  Trocar Ordem
                </button>
              </div>
            </aside>
          )}
        </div>

        {ordemFoiAlterada && (
          <div className="floating-save-button-container">
            <button
              onClick={handleSaveChanges}
              className="btn btn-primary floating-save-button"
            >
              Salvar Nova Ordem
            </button>
          </div>
        )}

        {showSwapModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Trocar Ordem de Membros</h2>
              <div className="form-group">
                <label htmlFor="member1-select">Primeiro Membro</label>
                <select
                  id="member1-select"
                  value={selectedMember1}
                  onChange={(e) => setSelectedMember1(e.target.value)}
                  className="form-select"
                >
                  <option value="">Selecione...</option>
                  {escala.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.membro?.NomeCompleto || item.NomeCompleto}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="member2-select">Segundo Membro</label>
                <select
                  id="member2-select"
                  value={selectedMember2}
                  onChange={(e) => setSelectedMember2(e.target.value)}
                  className="form-select"
                >
                  <option value="">Selecione...</option>
                  {escala.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.membro?.NomeCompleto || item.NomeCompleto}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button onClick={handleSwapOrder} className="btn btn-primary">
                  Trocar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default GestaoEscalaPage;