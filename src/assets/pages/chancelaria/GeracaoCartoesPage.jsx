// src/assets/pages/chancelaria/GeracaoCartoesPage.jsx
import React, { useState, useMemo } from "react";

import { useDataFetching } from "~/hooks/useDataFetching";
import { getAllMembers } from "~/services/memberService";
import { gerarCartao } from "~/services/chancelerService";
import { showSuccessToast, showErrorToast } from "~/utils/notifications";
import apiClient from "~/services/apiClient";
import "./GeracaoCartoes.css";
import "~/assets/styles/TableStyles.css";

const GeracaoCartoesPage = () => {
  
  const { data: members, isLoading, error } = useDataFetching(getAllMembers);
  const [isGenerating, setIsGenerating] = useState(null); // Controla o estado de loading de cada botão

  

  // CORREÇÃO: Os hooks useMemo foram movidos para o topo do componente, antes de qualquer retorno condicional.
  // Helper function to calculate the next upcoming birthday
  const getNextBirthday = (dateString) => {
    const today = new Date();
    const [_, month, day] = dateString.split('-').map(Number);
    let birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(today.getFullYear() + 1, month - 1, day);
    }
    return birthdayThisYear;
  };

  const sortedActiveMembers = useMemo(() => {
    if (!members) return [];
    return members
      .filter((m) => m.Situacao === "Ativo")
      .sort((a, b) => {
        const nextBirthdayA = getNextBirthday(a.DataNascimento);
        const nextBirthdayB = getNextBirthday(b.DataNascimento);
        return nextBirthdayA - nextBirthdayB;
      });
  }, [members]);

  const sortedAllFamiliares = useMemo(() => {
    if (!members) return [];
    const familiares = members.flatMap(
      (m) =>
        (m.familiares || [])
          .filter((f) => !f.falecido)
          .map((f) => ({ ...f, membroNome: m.NomeCompleto }))
    );
    return familiares.sort((a, b) => {
      const nextBirthdayA = getNextBirthday(a.dataNascimento);
      const nextBirthdayB = getNextBirthday(b.dataNascimento);
      return nextBirthdayA - nextBirthdayB;
    });
  }, [members]);

  const handleGenerateClick = async (id, type) => {
    setIsGenerating(`${type}-${id}`);
    try {
      const payload =
        type === "member" ? { memberId: id } : { familyMemberId: id };
      const response = await gerarCartao(payload);

      const filePath = response.data.caminho;
      const baseURL = apiClient.defaults.baseURL.startsWith("http")
        ? apiClient.defaults.baseURL
        : window.location.origin;
      const downloadUrl = `${baseURL}/${filePath}`.replace("/api/", "/");

      window.open(downloadUrl, "_blank");
      showSuccessToast("Cartão gerado e transferido com sucesso!");
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Não foi possível gerar o cartão."
      );
    } finally {
      setIsGenerating(null);
    }
  };

  

  return (
    <div className="geracao-cartoes-page">
      <div className="table-header">
        <h1>Geração Manual de Cartões de Aniversário</h1>
      </div>
      <p className="page-description">
        Selecione um membro ou familiar abaixo para gerar um cartão de
        aniversário em PDF sob demanda.
      </p>

      <div className="cards-generation-grid">
        <div className="generation-section">
          <h2>Membros da Loja</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data de Nascimento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="3">A carregar membros...</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="3" className="error-message">
                      {error}
                    </td>
                  </tr>
                )}
                
                  {sortedActiveMembers.map((member) => (
                  <tr key={`member-${member.id}`}>
                    <td>{member.NomeCompleto}</td>
                    <td>
                      {new Date(member.DataNascimento + 'T00:00:00').toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn-action btn-approve"
                        onClick={() => handleGenerateClick(member.id, "member")}
                        disabled={isGenerating === `member-${member.id}`}
                      >
                        {isGenerating === `member-${member.id}`
                          ? "A gerar..."
                          : "Gerar Cartão"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="generation-section">
          <h2>Familiares</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Parente</th>
                  <th>Data de Nascimento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan="4">A carregar familiares...</td>
                  </tr>
                )}
                {sortedAllFamiliares.map((familiar) => (
                  <tr key={`familiar-${familiar.id}`}>
                    <td>{familiar.nomeCompleto}</td>
                    <td>{familiar.membroNome}</td>
                    <td>
                      {new Date(familiar.dataNascimento + 'T00:00:00').toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn-action btn-approve"
                        onClick={() =>
                          handleGenerateClick(familiar.id, "familiar")
                        }
                        disabled={isGenerating === `familiar-${familiar.id}`}
                      >
                        {isGenerating === `familiar-${familiar.id}`
                          ? "A gerar..."
                          : "Gerar Cartão"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeracaoCartoesPage;
