import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emprestimoValidationSchema } from "../../../validators/emprestimoValidator.js";
import { getAllMembers } from "../../../services/memberService";
import "../../styles/FormStyles.css";

const EmprestimoForm = ({ livro, onSave, onCancel }) => {
  const [membros, setMembros] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(emprestimoValidationSchema),
    defaultValues: {
      livroId: livro.id,
      membroId: "",
      dataDevolucaoPrevista: "",
    },
  });

  useEffect(() => {
    // Carrega a lista de membros para o dropdown
    const fetchMembros = async () => {
      try {
        const response = await getAllMembers();
        // Filtra para mostrar apenas membros com status Aprovado
        setMembros(
          response.data.filter((m) => m.statusCadastro === "Aprovado")
        );
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    };
    fetchMembros();
  }, []);

  // O useEffect para resetar o formulário não é necessário aqui, pois
  // este formulário é sempre montado com um livro novo para emprestar.

  const onSubmit = (data) => {
    // Adiciona o livroId aos dados antes de salvar
    onSave({ ...data, livroId: livro.id });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <div className="form-group">
        <label>Livro</label>
        <input
          type="text"
          value={livro.titulo}
          disabled
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="membroId">Emprestar para o Membro</label>
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
        <label htmlFor="dataDevolucaoPrevista">
          Data de Devolução Prevista
        </label>
        <input
          id="dataDevolucaoPrevista"
          type="date"
          {...register("dataDevolucaoPrevista")}
          className={`form-input ${
            errors.dataDevolucaoPrevista ? "is-invalid" : ""
          }`}
        />
        {errors.dataDevolucaoPrevista && (
          <p className="form-error-message">
            {errors.dataDevolucaoPrevista.message}
          </p>
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
          {isSubmitting ? "A registar..." : "Confirmar Empréstimo"}
        </button>
      </div>
    </form>
  );
};

export default EmprestimoForm;
