import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { lancamentoValidationSchema } from "../../../validators/financeiroValidator.js";
import { getContas } from "../../../services/financeService.js";
import "../../styles/FormStyles.css";

const LancamentoForm = ({ onSave, onCancel }) => {
  const [contas, setContas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(lancamentoValidationSchema),
  });

  useEffect(() => {
    const fetchContas = async () => {
      try {
        const response = await getContas();
        setContas(response.data);
      } catch (error) {
        console.error("Erro ao buscar plano de contas:", error);
      }
    };
    fetchContas();
  }, []);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label htmlFor="descricao">Descrição do Lançamento</label>
        <input
          id="descricao"
          type="text"
          {...register("descricao")}
          className={`form-input ${errors.descricao ? "is-invalid" : ""}`}
        />
        {errors.descricao && (
          <p className="form-error-message">{errors.descricao.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="valor">Valor (R$)</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("valor")}
            className={`form-input ${errors.valor ? "is-invalid" : ""}`}
          />
          {errors.valor && (
            <p className="form-error-message">{errors.valor.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dataLancamento">Data do Lançamento</label>
          <input
            id="dataLancamento"
            type="date"
            {...register("dataLancamento")}
            className={`form-input ${
              errors.dataLancamento ? "is-invalid" : ""
            }`}
          />
          {errors.dataLancamento && (
            <p className="form-error-message">
              {errors.dataLancamento.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contaId">Conta (Receita/Despesa)</label>
        <select
          id="contaId"
          {...register("contaId")}
          className={`form-select ${errors.contaId ? "is-invalid" : ""}`}
        >
          <option value="">Selecione uma conta...</option>
          <optgroup label="Receitas">
            {contas
              .filter((c) => c.tipo === "Receita")
              .map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome}
                </option>
              ))}
          </optgroup>
          <optgroup label="Despesas">
            {contas
              .filter((c) => c.tipo === "Despesa")
              .map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome}
                </option>
              ))}
          </optgroup>
        </select>
        {errors.contaId && (
          <p className="form-error-message">{errors.contaId.message}</p>
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
          {isSubmitting ? "A registar..." : "Registar Lançamento"}
        </button>
      </div>
    </form>
  );
};

export default LancamentoForm;
