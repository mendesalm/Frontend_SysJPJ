import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDataFetching } from "../../../../../hooks/useDataFetching";
// 1. Importando as funções do novo serviço
import {
  searchVisitantes,
  getVisitantesDaSessao,
  addVisitanteNaSessao,
  deleteVisitanteDaSessao,
} from "../../../../../services/visitantesService";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../../../utils/notifications";
import { GRADUACAO_OPTIONS } from "../../../../../constants/userConstants";
import useDebounce from "../../../../../hooks/useDebounce";

const VisitantesTab = ({ sessionId }) => {
  // 2. Usando a função de serviço correta com useCallback
  const fetchVisitorsCallback = useCallback(
    () => getVisitantesDaSessao(sessionId),
    [sessionId]
  );
  const {
    data: visitantesRegistrados = [],
    isLoading: isLoadingList,
    refetch,
  } = useDataFetching(fetchVisitorsCallback);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 3) {
      setIsSearching(true);
      searchVisitantes(debouncedSearchTerm)
        .then((response) => setSearchResults(response.data))
        .catch((err) => console.error("Erro na busca de visitantes:", err))
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSelectVisitor = (visitor) => {
    setValue("nomeCompleto", visitor.nomeCompleto);
    setValue("cim", visitor.cim);
    setValue("graduacao", visitor.graduacao);
    setValue("potencia", visitor.potencia);
    setValue("loja", visitor.loja);
    setValue("oriente", visitor.oriente);
    setSearchTerm("");
    setSearchResults([]);
  };

  const onSubmit = async (data) => {
    try {
      // 3. Usando a função de serviço para adicionar
      await addVisitanteNaSessao(sessionId, data);
      showSuccessToast("Visitante adicionado com sucesso!");
      reset({
        graduacao: "Mestre",
        nomeCompleto: "",
        cim: "",
        loja: "",
        oriente: "",
        potencia: "",
      });
      refetch();
    } catch (error) {
      console.error("Erro ao adicionar visitante:", error);
      showErrorToast("Erro ao adicionar visitante.");
    }
  };

  const handleDeleteVisitor = async (visitorId) => {
    if (!window.confirm("Tem certeza que deseja remover este visitante?"))
      return;
    try {
      // 4. Usando a função de serviço para deletar
      await deleteVisitanteDaSessao(sessionId, visitorId);
      showSuccessToast("Visitante removido!");
      refetch();
    } catch (error) {
      console.error("Erro ao remover visitante:", error);
      showErrorToast("Não foi possível remover o visitante.");
    }
  };

  if (isLoadingList && !visitantesRegistrados.length)
    return <p>Carregando visitantes...</p>;

  return (
    <div className="card">
      <h3>Registro de Visitantes</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="visitor-form-layout">
        <div className="form-group search-group">
          <label>Buscar Visitante Recorrente</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou CIM (mín. 3 caracteres)"
            className="form-input"
          />
          {isSearching && (
            <div className="search-results-list">
              <p>Buscando...</p>
            </div>
          )}
          {searchResults.length > 0 && (
            <ul className="search-results-list">
              {searchResults.map((visitor) => (
                <li
                  key={visitor.id}
                  onClick={() => handleSelectVisitor(visitor)}
                >
                  <strong>{visitor.nomeCompleto}</strong> (CIM: {visitor.cim}){" "}
                  <br />
                  <small>
                    Loja: {visitor.loja} - {visitor.oriente}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr style={{ gridColumn: "1 / -1", margin: "1rem 0" }} />

        <div className="form-group">
          <label>Nome Completo</label>
          <input
            {...register("nomeCompleto", { required: true })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>CIM</label>
          <input {...register("cim")} className="form-input" />
        </div>
        <div className="form-group">
          <label>Graduação</label>
          <select {...register("graduacao")} className="form-select">
            {GRADUACAO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Potência</label>
          <input {...register("potencia")} className="form-input" />
        </div>
        <div className="form-group">
          <label>Loja de Origem</label>
          <input {...register("loja")} className="form-input" />
        </div>
        <div className="form-group">
          <label>Oriente</label>
          <input {...register("oriente")} className="form-input" />
        </div>

        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adicionando..." : "Adicionar Visitante à Sessão"}
          </button>
        </div>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h4>Visitantes Registrados na Sessão ({visitantesRegistrados.length})</h4>
      {isLoadingList ? (
        <p>Carregando...</p>
      ) : (
        <ul className="lista-simples">
          {visitantesRegistrados.length > 0 ? (
            visitantesRegistrados.map((v) => (
              <li key={v.id}>
                <div className="visitor-info">
                  <span className="nome">
                    <strong>{v.nomeCompleto}</strong> - {v.graduacao} (CIM:{" "}
                    {v.cim || "N/A"})
                  </span>
                  <span className="loja">
                    Loja: {v.loja || "Não informada"} | Oriente:{" "}
                    {v.oriente || "Não informado"} | Potência:{" "}
                    {v.potencia || "Não informada"}
                  </span>
                </div>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDeleteVisitor(v.id)}
                >
                  Remover
                </button>
              </li>
            ))
          ) : (
            <p>Nenhum visitante registrado para esta sessão.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default VisitantesTab;
