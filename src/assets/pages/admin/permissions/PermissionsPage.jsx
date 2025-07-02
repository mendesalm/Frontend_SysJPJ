import React, { useState, useMemo, useEffect } from "react";
import { useDataFetching } from "../../../../hooks/useDataFetching";
import {
  getPermissoes,
  updatePermissao,
  deletePermissao,
} from "../../../../services/permissionService";
import { getAllCargos } from "../../../../services/cargoService";
import Modal from "../../../../components/modal/Modal";
import ConfirmationModal from "../../../../components/modal/ConfirmationModal";
import "../../../../assets/styles/TableStyles.css";
import "../../../../assets/styles/FormStyles.css";
import { CREDENCIAIS } from "../../../../constants/userConstants";

const PermissionsPage = () => {
  // 1. Busca os dados da API.
  const {
    data: permissoesDaApi,
    isLoading: isLoadingPerms,
    error: errorPerms,
    refetch: refetchPerms,
  } = useDataFetching(getPermissoes);

  const {
    data: cargosResponse,
    isLoading: isLoadingCargos,
    error: errorCargos,
  } = useDataFetching(getAllCargos);

  // 2. Cria um estado local para as permissões que podem ser modificadas.
  const [localPermissoes, setLocalPermissoes] = useState([]);

  // 3. Sincroniza o estado local com os dados da API quando eles chegam.
  useEffect(() => {
    if (permissoesDaApi) {
      setLocalPermissoes(permissoesDaApi);
    }
  }, [permissoesDaApi]);

  const isLoading = isLoadingPerms || isLoadingCargos;
  const error = errorPerms || errorCargos;

  const todosOsCargos = useMemo(() => {
    const cargosArray = Array.isArray(cargosResponse)
      ? cargosResponse
      : cargosResponse?.data;

    if (!Array.isArray(cargosArray)) return [];

    return cargosArray.map((c) => c.NomeCargo).sort();
  }, [cargosResponse]);

  const [successMessage, setSuccessMessage] = useState("");
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [featureEmEdicao, setFeatureEmEdicao] = useState(null);
  const [newPermission, setNewPermission] = useState({
    nomeFuncionalidade: "",
    descricao: "",
  });
  const [actionError, setActionError] = useState("");
  const [modifiedPermissions, setModifiedPermissions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermissoes = useMemo(() => {
    if (!localPermissoes) return [];
    return localPermissoes.filter((p) => {
      const nome = p.nomeFuncionalidade || "";
      const descricao = p.descricao || "";
      return (
        nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [localPermissoes, searchTerm]);

  // CORREÇÃO: A função agora utiliza 'setLocalPermissoes' para atualizar o estado.
  const handleCredencialChange = (
    nomeFuncionalidade,
    credencial,
    isChecked
  ) => {
    setLocalPermissoes((permissoesAtuais) =>
      permissoesAtuais.map((p) => {
        if (p.nomeFuncionalidade === nomeFuncionalidade) {
          const updatedCredenciais = isChecked
            ? [...new Set([...(p.credenciaisPermitidas || []), credencial])]
            : (p.credenciaisPermitidas || []).filter((c) => c !== credencial);

          const updatedPermission = {
            ...p,
            credenciaisPermitidas: updatedCredenciais,
          };
          setModifiedPermissions((prev) => ({
            ...prev,
            [nomeFuncionalidade]: updatedPermission,
          }));
          return updatedPermission;
        }
        return p;
      })
    );
  };

  const handleBulkSave = async () => {
    const promises = Object.values(modifiedPermissions).map((p) =>
      updatePermissao(p)
    );
    try {
      setActionError("");
      setSuccessMessage("");
      await Promise.all(promises);
      setSuccessMessage("Alterações salvas com sucesso!");
      setModifiedPermissions({});
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao salvar permissões:", err);
      setActionError("Falha ao salvar algumas permissões.");
    }
  };

  const handleDelete = (nomeFuncionalidade) => {
    setPermissionToDelete(nomeFuncionalidade);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (permissionToDelete) {
      try {
        setActionError("");
        setSuccessMessage("");
        await deletePermissao({
          data: { nomeFuncionalidade: permissionToDelete },
        });
        setSuccessMessage(
          `Funcionalidade "${permissionToDelete}" deletada com sucesso!`
        );
        refetchPerms();
      } catch (err) {
        console.error("Erro ao deletar permissão:", err);
        setActionError(
          err.response?.data?.message ||
            `Falha ao deletar a funcionalidade "${permissionToDelete}".`
        );
      }
    }
    setIsConfirmModalOpen(false);
    setPermissionToDelete(null);
  };

  const openCargoModal = (funcionalidade) => {
    setFeatureEmEdicao(funcionalidade);
    setIsCargoModalOpen(true);
  };

  const handleCargoChangeInModal = (cargo, isChecked) => {
    setFeatureEmEdicao((featureAtual) => ({
      ...featureAtual,
      cargosPermitidos: isChecked
        ? [...new Set([...(featureAtual.cargosPermitidos || []), cargo])]
        : (featureAtual.cargosPermitidos || []).filter((c) => c !== cargo),
    }));
  };

  // CORREÇÃO: A função agora utiliza 'setLocalPermissoes'.
  const handleSaveCargos = () => {
    setLocalPermissoes((permissoesAtuais) =>
      permissoesAtuais.map((p) =>
        p.nomeFuncionalidade === featureEmEdicao.nomeFuncionalidade
          ? featureEmEdicao
          : p
      )
    );
    setModifiedPermissions((prev) => ({
      ...prev,
      [featureEmEdicao.nomeFuncionalidade]: featureEmEdicao,
    }));
    setIsCargoModalOpen(false);
    setFeatureEmEdicao(null);
  };

  const handleNewPermissionChange = (e) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePermission = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...newPermission,
      credenciaisPermitidas: ["Webmaster"],
      cargosPermitidos: [],
    };

    try {
      await updatePermissao(dataToSend);
      setSuccessMessage(
        `Funcionalidade "${newPermission.nomeFuncionalidade}" criada com sucesso!`
      );
      setIsCreateModalOpen(false);
      setNewPermission({ nomeFuncionalidade: "", descricao: "" });
      refetchPerms();
    } catch (err) {
      console.error("Erro ao criar nova permissão:", err);
      setActionError(
        err.response?.data?.message || "Falha ao criar a nova funcionalidade."
      );
    }
  };

  if (isLoading) {
    return <div className="table-page-container">Carregando permissões...</div>;
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Gestão de Permissões</h1>
        <div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-action btn-approve"
          >
            + Adicionar Funcionalidade
          </button>
          <button
            onClick={handleBulkSave}
            className="btn-action btn-approve"
            disabled={Object.keys(modifiedPermissions).length === 0}
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="table-filters">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {(error || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {error || actionError}
        </p>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Funcionalidade</th>
              {CREDENCIAIS.map((credencial) => (
                <th key={credencial}>{credencial}</th>
              ))}
              <th>Cargos Permitidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissoes.map((p) => (
              <tr
                key={p.id}
                className={
                  modifiedPermissions[p.nomeFuncionalidade] ? "modified" : ""
                }
              >
                <td>
                  {p.nomeFuncionalidade}
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      color: "#9CA3AF",
                    }}
                  >
                    {p.descricao}
                  </span>
                </td>
                {CREDENCIAIS.map((credencial) => (
                  <td key={credencial}>
                    <input
                      type="checkbox"
                      id={`${p.nomeFuncionalidade}-${credencial}`}
                      checked={(p.credenciaisPermitidas || []).includes(
                        credencial
                      )}
                      onChange={(e) =>
                        handleCredencialChange(
                          p.nomeFuncionalidade,
                          credencial,
                          e.target.checked
                        )
                      }
                      disabled={credencial === "Webmaster"}
                      style={{ transform: "scale(1.2)" }}
                    />
                  </td>
                ))}
                <td className="cargo-cell">
                  <button
                    onClick={() => openCargoModal(p)}
                    className="btn-action btn-edit"
                  >
                    Gerir ({(p.cargosPermitidos || []).length})
                  </button>
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleDelete(p.nomeFuncionalidade)}
                    className="btn-action btn-delete"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCargoModalOpen && (
        <Modal
          isOpen={isCargoModalOpen}
          onClose={() => setIsCargoModalOpen(false)}
          title={`Gerir Cargos para: ${featureEmEdicao?.nomeFuncionalidade}`}
        >
          <div className="cargo-modal-content">
            <p>Selecione os cargos que terão acesso a esta funcionalidade.</p>
            <div className="cargo-checkbox-list">
              {todosOsCargos.map((cargo) => (
                <div key={cargo} className="cargo-checkbox-item">
                  <input
                    type="checkbox"
                    id={`cargo-${featureEmEdicao?.nomeFuncionalidade}-${cargo}`}
                    checked={(featureEmEdicao?.cargosPermitidos || []).includes(
                      cargo
                    )}
                    onChange={(e) =>
                      handleCargoChangeInModal(cargo, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={`cargo-${featureEmEdicao?.nomeFuncionalidade}-${cargo}`}
                  >
                    {cargo}
                  </label>
                </div>
              ))}
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsCargoModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCargos}
                className="btn btn-primary"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Adicionar Nova Funcionalidade"
      >
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
              placeholder="Ex: gerirComissoes"
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
              placeholder="Ex: Permite visualizar, criar e editar comissões."
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Criar
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Tem a certeza que deseja deletar a funcionalidade "${permissionToDelete}"?`}
      />
    </div>
  );
};

export default PermissionsPage;
