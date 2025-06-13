import React, { useState } from "react";
import { useDataFetching } from "../../../hooks/useDataFetching"; // 1. Importa o hook
import {
  getLancamentos,
  createLancamento,
} from "../../../services/financeService";
import Modal from "../../../components/modal/Modal";
import LancamentoForm from "./LancamentoForm";
import "../../styles/TableStyles.css";

const LancamentosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  // Estado para os filtros permanece o mesmo
  const [filter, setFilter] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  });

  // 2. O hook agora recebe a função de serviço E um array com seus parâmetros.
  // O hook irá refazer a busca automaticamente sempre que o `filter` mudar.
  const {
    data: lancamentos,
    isLoading,
    error: fetchError,
    refetch,
  } = useDataFetching(getLancamentos, [filter]);

  const handleSave = async (formData) => {
    try {
      setActionError("");
      await createLancamento(formData);
      refetch(); // 3. Usa o refetch para atualizar a lista após um novo lançamento
      setIsModalOpen(false);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Erro ao salvar o lançamento."
      );
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="table-page-container">
      <div className="table-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <h1>Lançamentos Financeiros</h1>
        <div>
          <select
            name="mes"
            value={filter.mes}
            onChange={handleFilterChange}
            style={{
              marginRight: "10px",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #4b5563",
              backgroundColor: "#1f2937",
              color: "white",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="ano"
            value={filter.ano}
            onChange={handleFilterChange}
            style={{
              padding: "8px",
              width: "100px",
              borderRadius: "6px",
              border: "1px solid #4b5563",
              backgroundColor: "#1f2937",
              color: "white",
            }}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-action btn-approve"
          style={{ height: "fit-content" }}
        >
          Novo Lançamento
        </button>
      </div>

      {(fetchError || actionError) && (
        <p className="error-message" onClick={() => setActionError("")}>
          {fetchError || actionError}
        </p>
      )}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Conta</th>
              <th>Tipo</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  A carregar...
                </td>
              </tr>
            ) : lancamentos.length === 0 ? (
              // 4. Tratamento para estado vazio
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum lançamento encontrado para este período.
                </td>
              </tr>
            ) : (
              lancamentos.map((lanc) => (
                <tr key={lanc.id}>
                  <td>
                    {new Date(lanc.dataLancamento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>{lanc.descricao}</td>
                  <td>{lanc.conta?.nome}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        lanc.conta?.tipo === "Receita"
                          ? "status-aprovado"
                          : "status-rejeitado"
                      }`}
                    >
                      {lanc.conta?.tipo}
                    </span>
                  </td>
                  <td
                    style={{
                      color:
                        lanc.conta?.tipo === "Receita" ? "#22c55e" : "#ef4444",
                      fontWeight: "500",
                    }}
                  >
                    {lanc.conta?.tipo === "Despesa" && "- "}
                    {parseFloat(lanc.valor).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lançamento"
      >
        <LancamentoForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default LancamentosPage;
