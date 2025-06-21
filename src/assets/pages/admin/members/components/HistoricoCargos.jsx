import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDataFetching } from "../../../../../hooks/useDataFetching";
import { CARGOS_LOJA } from "../../../../../constants/userConstants";
// CORREÇÃO: Adicionando a função 'getCargosMembro' à lista de importação
import {
  getCargosMembro,
  addCargoMembro,
  deleteCargoMembro,
} from "../../../../../services/memberService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";
import { FaTrash } from "react-icons/fa";

const HistoricoCargos = ({ memberId }) => {
  // Esta chamada agora funcionará, pois a função foi importada
  const { data: cargos, refetch } = useDataFetching(() =>
    getCargosMembro(memberId)
  );

  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data };
      if (!payload.dataTermino) {
        delete payload.dataTermino;
      }
      await addCargoMembro(memberId, payload);
      showSuccessToast("Cargo adicionado ao histórico com sucesso!");
      reset();
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar cargo:", error);
      showErrorToast("Não foi possível adicionar o cargo.");
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
        showErrorToast("Não foi possível remover o registro.");
      }
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
      : "Presente";

  return (
    <div className="form-section">
      <h3 className="section-title">Histórico de Cargos</h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-grid add-cargo-form"
      >
        <div className="form-group">
          <label>Cargo</label>
          <select {...register("nomeCargo")} className="form-select" required>
            {CARGOS_LOJA.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Data de Início</label>
          <input
            type="date"
            {...register("dataInicio")}
            className="form-input"
            required
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
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adicionando..." : "Adicionar Cargo"}
        </button>
      </form>

      <div className="table-responsive" style={{ marginTop: "2rem" }}>
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
            {cargos && cargos.length > 0 ? (
              cargos.map((cargo) => (
                <tr key={cargo.id}>
                  <td>{cargo.nomeCargo}</td>
                  <td>{formatDate(cargo.dataInicio)}</td>
                  <td>{formatDate(cargo.dataTermino)}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleDelete(cargo.id)}
                      className="btn-action btn-delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nenhum cargo anterior registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricoCargos;
