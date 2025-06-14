// src/assets/pages/visitacoes/VisitacaoForm.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  visitacaoValidationSchema,
  TIPO_SESSAO_OPTIONS,
} from "../../../validators/visitacaoValidator";
import { getAllMembers } from "../../../services/memberService";
import "../../../assets/styles/FormStyles.css";

const VisitacaoForm = ({ visitaToEdit, onSave, onCancel }) => {
  const [membros, setMembros] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(visitacaoValidationSchema),
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        // Assume que getAllMembers pode retornar todos os membros sem paginação para este select
        const response = await getAllMembers({ limit: 500 });
        setMembros(response.data.data || response.data);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    }
    fetchMembers();
  }, []);

  useEffect(() => {
    if (visitaToEdit) {
      reset({
        ...visitaToEdit,
        dataVisita: new Date(visitaToEdit.dataVisita)
          .toISOString()
          .split("T")[0],
      });
    } else {
      reset();
    }
  }, [visitaToEdit, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <div className="form-group">
        <label htmlFor="membroId">Membro</label>
        <select
          id="membroId"
          {...register("membroId")}
          className={`form-select ${errors.membroId ? "is-invalid" : ""}`}
        >
          <option value="">Selecione um membro...</option>
          {membros.map((membro) => (
            <option key={membro.id} value={membro.id}>
              {membro.NomeCompleto}
            </option>
          ))}
        </select>
        {errors.membroId && (
          <p className="form-error-message">{errors.membroId.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="nomeLojaVisitada">Loja Visitada</label>
        <input
          id="nomeLojaVisitada"
          type="text"
          {...register("nomeLojaVisitada")}
          className={`form-input ${
            errors.nomeLojaVisitada ? "is-invalid" : ""
          }`}
        />
        {errors.nomeLojaVisitada && (
          <p className="form-error-message">
            {errors.nomeLojaVisitada.message}
          </p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="dataVisita">Data da Visita</label>
          <input
            id="dataVisita"
            type="date"
            {...register("dataVisita")}
            className={`form-input ${errors.dataVisita ? "is-invalid" : ""}`}
          />
          {errors.dataVisita && (
            <p className="form-error-message">{errors.dataVisita.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="tipoSessao">Tipo de Sessão</label>
          <select
            id="tipoSessao"
            {...register("tipoSessao")}
            className={`form-select ${errors.tipoSessao ? "is-invalid" : ""}`}
          >
            {TIPO_SESSAO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.tipoSessao && (
            <p className="form-error-message">{errors.tipoSessao.message}</p>
          )}
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="orienteLojaVisitada">Oriente da Loja</label>
          <input
            id="orienteLojaVisitada"
            type="text"
            {...register("orienteLojaVisitada")}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="potenciaLojaVisitada">Potência</label>
          <input
            id="potenciaLojaVisitada"
            type="text"
            {...register("potenciaLojaVisitada")}
            className="form-input"
          />
        </div>
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
          {isSubmitting ? "A salvar..." : "Salvar Registro"}
        </button>
      </div>
    </form>
  );
};

export default VisitacaoForm;
