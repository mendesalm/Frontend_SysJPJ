import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDataFetching } from "../../../../../hooks/useDataFetching";
import { CARGOS_LOJA } from "../../../../../constants/userConstants";
import {
  getCargosMembro,
  addCargoMembro,
  updateCargoMembro,
  deleteCargoMembro,
} from "../../../../../services/memberService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import "./HistoricoCargos.css";

const HistoricoCargos = ({ memberId }) => {
  const fetchCargos = useCallback(() => {
    if (memberId) {
      return getCargosMembro(memberId);
    }
    return Promise.resolve({ data: [] });
  }, [memberId]);

  const {
    data: cargos,
    isLoading,
    error,
    refetch,
  } = useDataFetching(fetchCargos);

  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCargoId, setEditingCargoId] = useState(null);

  const onSubmit = async (data) => {
    // Validação manual para garantir que os campos não estão vazios ao adicionar/editar.
    if (!data.nomeCargo || !data.dataInicio) {
      showErrorToast("Por favor, selecione um Cargo e uma Data de Início.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...data };

      if (data.dataInicio) {
        const dateInicio = new Date(data.dataInicio);
        payload.dataInicio = new Date(
          dateInicio.getTime() + dateInicio.getTimezoneOffset() * 60000
        );
      }
      if (data.dataTermino) {
        const dateTermino = new Date(data.dataTermino);
        payload.dataTermino = new Date(
          dateTermino.getTime() + dateTermino.getTimezoneOffset() * 60000
        );
      } else {
        payload.dataTermino = null;
      }

      if (editingCargoId) {
        await updateCargoMembro(memberId, editingCargoId, payload);
        showSuccessToast("Cargo atualizado com sucesso!");
      } else {
        await addCargoMembro(memberId, payload);
        showSuccessToast("Cargo adicionado ao histórico com sucesso!");
      }

      reset({ nomeCargo: "", dataInicio: "", dataTermino: "" });
      setEditingCargoId(null);
      refetch();
    } catch (error) {
      console.error("Erro ao salvar cargo:", error);
      const action = editingCargoId ? "atualizar" : "adicionar";
      showErrorToast(
        error.response?.data?.message || `Não foi possível ${action} o cargo.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cargoId) => {
    if (
      window.confirm("Tem certeza que deseja remover este registro de cargo?")
    ) {
      try {
        await deleteCargoMembro(memberId, cargoId);
        showSuccessToast("Registro de cargo removido.");
        refetch();
      } catch (error) {
        console.error("Erro ao remover cargo:", error);
        showErrorToast(
          error.response?.data?.message ||
            "Não foi possível remover o registro."
        );
      }
    }
  };

  const handleEditClick = (cargo) => {
    setEditingCargoId(cargo.id);
    reset({
      nomeCargo: cargo.nomeCargo,
      dataInicio: cargo.dataInicio
        ? new Date(cargo.dataInicio).toISOString().split("T")[0]
        : "",
      dataTermino: cargo.dataTermino
        ? new Date(cargo.dataTermino).toISOString().split("T")[0]
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingCargoId(null);
    reset({ nomeCargo: "", dataInicio: "", dataTermino: "" });
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
      : "Presente";

  return (
    <fieldset className="form-fieldset">
      <legend>
        {editingCargoId ? "Editar Cargo" : "Adicionar Novo Cargo"}
      </legend>

      <div className="cargo-form-container">
        <div className="form-group">
          <label>Cargo</label>
          {/* CORREÇÃO: Removido o atributo 'required' */}
          <select {...register("nomeCargo")} className="form-select">
            <option value="">-- Selecione --</option>
            {CARGOS_LOJA.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Data de Início</label>
          {/* CORREÇÃO: Removido o atributo 'required' */}
          <input
            type="date"
            {...register("dataInicio")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Data de Término (opcional)</label>
          <input
            type="date"
            {...register("dataTermino")}
            className="form-input"
          />
        </div>
        <div
          className="form-actions"
          style={{
            borderTop: "none",
            paddingTop: 0,
            paddingBottom: 0,
            gap: "0.5rem",
            alignSelf: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Salvando..."
              : editingCargoId
              ? "Atualizar"
              : "Adicionar"}
          </button>
          {editingCargoId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="historico-table-container">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Cargo</th>
                <th>Início</th>
                <th>Término</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    A carregar histórico...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td
                    colSpan="4"
                    className="form-error-message"
                    style={{ textAlign: "center" }}
                  >{`Erro ao carregar dados: ${error}`}</td>
                </tr>
              )}
              {!isLoading && !error && cargos?.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Nenhum cargo anterior registado.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !error &&
                cargos?.map((cargo) => (
                  <tr key={cargo.id}>
                    <td>{cargo.nomeCargo}</td>
                    <td>{formatDate(cargo.dataInicio)}</td>
                    <td>{formatDate(cargo.dataTermino)}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        onClick={() => handleEditClick(cargo)}
                        className="btn-action btn-edit"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cargo.id)}
                        className="btn-action btn-delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </fieldset>
  );
};

export default HistoricoCargos;
