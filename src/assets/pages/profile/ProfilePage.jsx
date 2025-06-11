import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { updateMyProfile } from "../../../services/memberService";
import { consultarCEP } from "../../../services/cepService.js"; // Importa o serviço de CEP
import "../../styles/FormStyles.css";

const ProfilePage = () => {
  const { user, loading: authLoading, checkUserStatus } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cepStatus, setCepStatus] = useState(""); // Estado para a mensagem de status do CEP

  useEffect(() => {
    if (user) {
      setFormData({ ...user, familiares: user.familiares || [] });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFamilyChange = (index, e) => {
    const updatedFamiliares = formData.familiares.map((familiar, i) => {
      if (index === i) {
        return { ...familiar, [e.target.name]: e.target.value };
      }
      return familiar;
    });
    setFormData((prev) => ({ ...prev, familiares: updatedFamiliares }));
  };

  const addFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familiares: [
        ...(prev.familiares || []),
        { nomeCompleto: "", parentesco: "Filho", dataNascimento: "" },
      ],
    }));
  };

  const removeFamilyMember = (index) => {
    const familiarToRemove = formData.familiares[index];
    if (
      familiarToRemove.id &&
      !window.confirm(
        `Tem certeza que deseja remover ${familiarToRemove.nomeCompleto}?`
      )
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      familiares: prev.familiares.filter((_, i) => i !== index),
    }));
  };

  const handleCepBlur = async (e) => {
    const cepLimpo = (e.target.value || "").replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepStatus("");
      return;
    }

    setCepStatus("A consultar...");
    try {
      const data = await consultarCEP(cepLimpo);
      setFormData((prev) => ({
        ...prev,
        Endereco_Rua: data.logradouro,
        Endereco_Bairro: data.bairro,
        Endereco_Cidade: data.localidade,
      }));
      setCepStatus("Endereço preenchido!");
    } catch (error) {
      setCepStatus(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await updateMyProfile(formData);
      await checkUserStatus();
      setSuccessMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError(
        err.response?.data?.message || "Não foi possível salvar as alterações."
      );
    }
  };

  if (authLoading || !formData) {
    return <div className="table-page-container">A carregar perfil...</div>;
  }

  return (
    <div className="table-page-container">
      <div className="table-header">
        <h1>Meu Perfil</h1>
      </div>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form
        onSubmit={handleSubmit}
        className="form-container"
        style={{ padding: 0 }}
      >
        <fieldset className="form-fieldset">
          <legend>Dados Pessoais</legend>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nome Completo</label>
              <input
                type="text"
                name="NomeCompleto"
                value={formData.NomeCompleto || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>CPF (não editável)</label>
              <input
                type="text"
                value={formData.CPF || ""}
                disabled
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email || ""}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Identidade (RG)</label>
              <input
                type="text"
                name="Identidade"
                value={formData.Identidade || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                name="DataNascimento"
                value={formData.DataNascimento?.split("T")[0] || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                name="Telefone"
                value={formData.Telefone || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend>Endereço</legend>
          <div className="form-grid" style={{ gridTemplateColumns: "1fr 3fr" }}>
            <div className="form-group">
              <label>CEP</label>
              <input
                type="text"
                name="Endereco_CEP"
                value={formData.Endereco_CEP || ""}
                onChange={handleChange}
                onBlur={handleCepBlur}
                className="form-input"
              />
              {cepStatus && (
                <small
                  style={{ color: "var(--cor-foco-input)", marginTop: "5px" }}
                >
                  {cepStatus}
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Rua / Avenida</label>
              <input
                type="text"
                name="Endereco_Rua"
                value={formData.Endereco_Rua || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Número</label>
              <input
                type="text"
                name="Endereco_Numero"
                value={formData.Endereco_Numero || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input
                type="text"
                name="Endereco_Bairro"
                value={formData.Endereco_Bairro || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                name="Endereco_Cidade"
                value={formData.Endereco_Cidade || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-fieldset">
          <legend>Familiares</legend>
          {formData.familiares?.map((familiar, index) => (
            <div
              key={familiar.id || index}
              className="form-grid"
              style={{
                alignItems: "flex-end",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--cor-borda-input)",
                paddingBottom: "1rem",
              }}
            >
              <div className="form-group">
                <label>Nome do Familiar</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={familiar.nomeCompleto}
                  onChange={(e) => handleFamilyChange(index, e)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Parentesco</label>
                <select
                  name="parentesco"
                  value={familiar.parentesco}
                  onChange={(e) => handleFamilyChange(index, e)}
                  className="form-select"
                >
                  <option value="Cônjuge">Cônjuge</option>
                  <option value="Esposa">Esposa</option>
                  <option value="Filho">Filho</option>
                  <option value="Filha">Filha</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data de Nasc.</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={familiar.dataNascimento?.split("T")[0] || ""}
                  onChange={(e) => handleFamilyChange(index, e)}
                  className="form-input"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="btn btn-secondary"
                  style={{ backgroundColor: "#b91c1c" }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFamilyMember}
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            + Adicionar Familiar
          </button>
        </fieldset>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn btn-secondary"
          >
            Voltar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
