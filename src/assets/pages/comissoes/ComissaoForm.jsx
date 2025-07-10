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
    setValue,
  } = useForm({
    resolver: yupResolver(comissaoValidationSchema),
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await getAllMembers({ limit: 999 }); // Busca todos os membros
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
          ? new Date(new Date(comissaoToEdit.dataInicio).getTime() + new Date(comissaoToEdit.dataInicio).getTimezoneOffset() * 60000).toISOString().split("T")[0]
          : "",
        dataFim: comissaoToEdit.dataFim
          ? new Date(new Date(comissaoToEdit.dataFim).getTime() + new Date(comissaoToEdit.dataFim).getTimezoneOffset() * 60000).toISOString().split("T")[0]
          : "",
      });
      setValue("presidenteId", comissaoToEdit.presidenteId);
      setValue("membrosIds", comissaoToEdit.membros.filter(m => m.id !== comissaoToEdit.presidenteId).map((m) => m.id));
    } else {
      reset({
        nome: "",
        descricao: "",
        tipo: "Temporária",
        dataInicio: "",
        dataFim: "",
        membrosIds: [],
      });
    }
  }, [comissaoToEdit, reset, setValue]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
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
          <label htmlFor="dataFim">Data Final</label>
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
        <label htmlFor="presidenteId">Presidente da Comissão</label>
        <select
          id="presidenteId"
          {...register("presidenteId")}
          className={`form-select ${errors.presidenteId ? "is-invalid" : ""}`}>

          <option value="">Selecione um presidente</option>
          {membrosDisponiveis.map((membro) => (
            <option key={membro.id} value={membro.id}>
              {membro.NomeCompleto}
            </option>
          ))}
        </select>
        {errors.presidenteId && (
          <p className="form-error-message">{errors.presidenteId.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>Membros da Comissão (mínimo 2)</label>
        <div className="checkbox-group" style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
          {membrosDisponiveis.map((membro) => (
            <div key={membro.id} className="form-check">
              <input
                type="checkbox"
                id={`membro-${membro.id}`}
                value={membro.id}
                {...register("membrosIds")}
                className="form-check-input"
              />
              <label htmlFor={`membro-${membro.id}`} className="form-check-label">
                {membro.NomeCompleto}
              </label>
            </div>
          ))}
        </div>
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
