import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { comissaoValidationSchema } from "../../../validators/comissaoValidator.js";
import { getAllMembers } from "../../../services/memberService";
import "../../styles/FormStyles.css";

const ComissaoForm = ({ comissaoToEdit, onSave, onCancel }) => {
  const [membrosDisponiveis, setMembrosDisponiveis] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //setValue,
  } = useForm({
    resolver: yupResolver(comissaoValidationSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tipo: "Temporária",
      dataInicio: "",
      dataFim: "",
      membrosIds: [],
    },
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await getAllMembers();
        setMembrosDisponiveis(response.data);
      } catch (error) {
        console.error("Erro ao buscar membros", error);
      }
    }
    fetchMembers();
  }, []);

  useEffect(() => {
    if (comissaoToEdit) {
      reset({
        ...comissaoToEdit,
        dataInicio: comissaoToEdit.dataInicio
          ? new Date(comissaoToEdit.dataInicio).toISOString().split("T")[0]
          : "",
        dataFim: comissaoToEdit.dataFim
          ? new Date(comissaoToEdit.dataFim).toISOString().split("T")[0]
          : "",
        // O `react-hook-form` lida bem com a seleção múltipla se o `value` do select for um array
        membrosIds: comissaoToEdit.membros.map((m) => m.id),
      });
    } else {
      reset();
    }
  }, [comissaoToEdit, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="nome">Nome da Comissão</label>
        <input
          id="nome"
          type="text"
          {...register("nome")}
          className={`form-input ${errors.nome ? "is-invalid" : ""}`}
        />
        {errors.nome && (
          <p className="form-error-message">{errors.nome.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          rows="3"
          {...register("descricao")}
          className={`form-textarea ${errors.descricao ? "is-invalid" : ""}`}
        />
        {errors.descricao && (
          <p className="form-error-message">{errors.descricao.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            {...register("tipo")}
            className={`form-select ${errors.tipo ? "is-invalid" : ""}`}
          >
            <option value="Temporária">Temporária</option>
            <option value="Permanente">Permanente</option>
          </select>
          {errors.tipo && (
            <p className="form-error-message">{errors.tipo.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dataInicio">Data de Início</label>
          <input
            id="dataInicio"
            type="date"
            {...register("dataInicio")}
            className={`form-input ${errors.dataInicio ? "is-invalid" : ""}`}
          />
          {errors.dataInicio && (
            <p className="form-error-message">{errors.dataInicio.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="dataFim">Data Final (opcional)</label>
          <input
            id="dataFim"
            type="date"
            {...register("dataFim")}
            className={`form-input ${errors.dataFim ? "is-invalid" : ""}`}
          />
          {errors.dataFim && (
            <p className="form-error-message">{errors.dataFim.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="membrosIds">Membros da Comissão</label>
        <select
          id="membrosIds"
          multiple
          {...register("membrosIds")}
          className={`form-select ${errors.membrosIds ? "is-invalid" : ""}`}
        >
          {membrosDisponiveis.map((membro) => (
            <option key={membro.id} value={membro.id}>
              {membro.NomeCompleto}
            </option>
          ))}
        </select>
        {errors.membrosIds && (
          <p className="form-error-message">{errors.membrosIds.message}</p>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "A salvar..." : "Salvar Comissão"}
        </button>
      </div>
    </form>
  );
};

export default ComissaoForm;
