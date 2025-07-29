import React, { useState, useEffect } from "react";
import "./BalaustreForm.css";
import defaultLogoLoja from "../../images/logoJPJ.png";
import defaultLogoRB from "../../images/RitoBrasileiro.png";
import InputAjustavel from "./components/InputAjustavel";
import TextareaAjustavel from "./components/TextareaAjustavel";

const initialState = {
  numero_balaustre: "",
  classe_sessao_titulo: "",
  hora_inicio_sessao: "",
  dia_sessao: "",
  tipo_sessao_corpo: "",
  subtipo_sessao_corpo: "",
  numero_irmaos_quadro: "",
  numero_visitantes: "",
  veneravel: "",
  primeiro_vigilante: "",
  segundo_vigilante: "",
  orador: "",
  secretario: "",
  tesoureiro: "",
  chanceler: "",
  balaustre_anterior: "", // Campo unificado
  expediente_recebido: "",
  expediente_expedido: "",
  saco_proposta: "",
  ordem_dia: "",
  escrutinio: "",
  tempo_instrucao: "",
  tronco_beneficencia: "",
  palavra: "",
  hora_encerramento: "",
  emendas: "",
  data_assinatura: "",
  secretario_nome: "",
  orador_nome: "",
  veneravel_nome: "",
};

const defaultLogo1 = defaultLogoLoja;
const defaultLogo2 = defaultLogoRB;

function parseDateStringToYMD(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";
  const months = {
    janeiro: "01",
    fevereiro: "02",
    março: "03",
    abril: "04",
    maio: "05",
    junho: "06",
    julho: "07",
    agosto: "08",
    setembro: "09",
    outubro: "10",
    novembro: "11",
    dezembro: "12",
  };
  const parts = dateStr.split(" de ");
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, "0");
  const month = months[parts[1].toLowerCase()];
  const year = parts[2];
  if (!day || !month || !year) return dateStr;
  return `${year}-${month}-${day}`;
}

function parseHourString(str) {
  if (!str) return null;
  str = str.trim().toLowerCase();

  let match = str.match(/^(\d{1,2})[:h_H]?(\d{0,2})$/);
  if (match) {
    let hour = parseInt(match[1], 10);
    let minute = match[2] ? parseInt(match[2], 10) : 0;

    if (!str.includes(":") && !str.includes("h") && str.length === 4) {
      hour = parseInt(str.slice(0, 2), 10);
      minute = parseInt(str.slice(2, 4), 10);
    }
    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    }
  }
  let matchHourOnly = str.match(/^(\d{1,2})$/);
  if (matchHourOnly) {
    let hour = parseInt(matchHourOnly[1], 10);
    if (hour >= 0 && hour < 24) {
      return `${hour.toString().padStart(2, "0")}:00`;
    }
  }
  return null;
}

export default function BalaustreForm({
  formId,
  initialData,
  onSave,
  isSubmitting,
  readOnly,
}) {
  const [form, setForm] = useState(initialState);
  const [logoEsquerdo, setLogoEsquerdo] = useState(defaultLogo1);
  const [logoDireito, setLogoDireito] = useState(defaultLogo2);

  useEffect(() => {
    if (initialData) {
      const today = new Date();
      const todayString = today.toISOString().substring(0, 10);

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      const defaultPreviousSessionDate = sevenDaysAgo.toLocaleDateString(
        "pt-BR",
        { day: "2-digit", month: "long", year: "numeric" }
      );

      const mappedData = {
        numero_balaustre: initialData.numero_balaustre,
        classe_sessao_titulo: initialData.classe_sessao,
        hora_inicio_sessao: parseHourString(initialData.hora_sessao),
        dia_sessao: parseDateStringToYMD(initialData.dia_sessao),
        classe_sessao_corpo: initialData.classe_sessao,
        tipo_sessao_corpo: initialData.tipo_sessao,
        subtipo_sessao_corpo: initialData.grau_sessao,
        numero_irmaos_quadro: initialData.numero_irmaos_quadro,
        numero_visitantes: initialData.numero_visitantes,
        veneravel: initialData.veneravel,
        primeiro_vigilante: initialData.primeiro_vigilante,
        segundo_vigilante: initialData.segundo_vigilante,
        orador: initialData.orador,
        secretario: initialData.secretario,
        tesoureiro: initialData.tesoureiro,
        chanceler: initialData.chanceler,
        balaustre_anterior: initialData.balaustre_anterior, // Mapeia o novo campo
        expediente_recebido: initialData.expediente_recebido,
        expediente_expedido: initialData.expediente_expedido,
        saco_proposta: initialData.saco_proposta,
        ordem_dia: initialData.ordem_dia,
        escrutinio: initialData.escrutinio,
        tempo_instrucao: initialData.tempo_instrucao,
        tronco_beneficencia: initialData.tronco_beneficencia,
        palavra: initialData.palavra,
        hora_encerramento: parseHourString(initialData.hora_encerramento),
        emendas: initialData.emendas,
        data_assinatura: parseDateStringToYMD(initialData.data_assinatura),
        secretario_nome: initialData.secretario,
        orador_nome: initialData.orador,
        veneravel_nome: initialData.veneravel,
      };

      const fieldDefaults = {
        escrutinio: "Não houve",
        balaustre_anterior: `Lido e aprovado o Balaústre da Sessão do dia ${defaultPreviousSessionDate}, sem emendas.`,
        data_assinatura: todayString,
        hora_encerramento: "21:15",
        emendas: "",
        saco_proposta:
          "colheu xx peças que, decifradas pelo Ven∴ Mestre, trataram-se de yy certificados de presenças de irmão do quadro em lojas coirmãs, ...",
        expediente_recebido: "nada constou",
        expediente_expedido: "nada constou",
        tempo_instrucao: "preenchido pelo Ir∴ 2º Vigilante, abordou o tema...",
        palavra:
          "na Coluna do Norte, o Ir∴ Chanceler anunciou os aniversariantes do período, informou que o jantar da sessão em curso foi oferecido pelo Ir∴ AAA e pela Cunhada BBB e que o jantar seguinte será oferecido pelo Ir∴ CCC e pela Cunhada BBB; na Coluna do Sul, o Ir∴ Tesoureiro anunciou o tronco de benficência, conforme supracitado; no Oriente, O Ven∴ Mestre solicitou uma bateria incessante para os aniversáriantes ...  ",
      };

      const finalFormState = {};
      for (const key in initialState) {
        const apiValue = mappedData[key];
        const defaultValue = fieldDefaults[key];
        finalFormState[key] = apiValue ? apiValue : defaultValue ?? "";
      }

      setForm(finalFormState);
    }
  }, [initialData]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleLogoChange(e, setLogo) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    } else {
      setLogo(defaultLogo1);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      NumeroBalaustre: form.numero_balaustre,
      ClasseSessao: form.classe_sessao_titulo,
      HoraInicioSessao: form.hora_inicio_sessao,
      DiaSessao: form.dia_sessao,
      TipoSessao: form.tipo_sessao_corpo,
      SubtipoSessao: form.subtipo_sessao_corpo,
      NumeroIrmaosQuadro: form.numero_irmaos_quadro,
      NumeroVisitantes: form.numero_visitantes,
      Veneravel: form.veneravel,
      PrimeiroVigilante: form.primeiro_vigilante,
      SegundoVigilante: form.segundo_vigilante,
      Orador: form.orador,
      Secretario: form.secretario,
      Tesoureiro: form.tesoureiro,
      Chanceler: form.chanceler,
      BalaustreAnterior: form.balaustre_anterior, // Envia o novo campo
      ExpedienteRecebido: form.expediente_recebido,
      ExpedienteExpedido: form.expediente_expedido,
      SacoProposta: form.saco_proposta,
      OrdemDia: form.ordem_dia,
      Escrutinio: form.escrutinio,
      TempoInstrucao: form.tempo_instrucao,
      TroncoBeneficiencia: form.tronco_beneficencia,
      Palavra: form.palavra,
      HoraEncerramento: form.hora_encerramento,
      Emendas: form.emendas,
      DataAssinatura: form.data_assinatura,
      SecretarioNome: form.secretario_nome,
      OradorNome: form.orador_nome,
      VeneravelNome: form.veneravel_nome,
    };
    onSave(payload);
  }

  return (
    <form id={formId} className="document-content" onSubmit={handleSubmit}>
      <header className="header-grid">
        <div className="header-logo logo-col-left">
          <label title="Trocar logo esquerdo" style={{ cursor: "pointer" }}>
            <img src={logoEsquerdo} alt="Logo Esquerdo" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleLogoChange(e, setLogoEsquerdo)}
              disabled={readOnly}
            />
          </label>
        </div>
        <div className="header-text">
          <label title="Trocar logo direito">
            <img
              src={logoDireito}
              alt="Logo Direito"
              className="logo-in-text"
              style={{ cursor: "pointer" }}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleLogoChange(e, setLogoDireito)}
              disabled={readOnly}
            />
          </label>
          <p className="lodge-name">
            Loja Maçônica João Pedro Junqueira nº 2181
          </p>
          <p className="affiliation">Federada ao Grande Oriente do Brasil</p>
          <p className="affiliation">
            Jurisdicionada ao Grande Oriente do Brasil - Goiás
          </p>
        </div>
      </header>

      <p className="mso-title" style={{ lineHeight: "1.2" }}>
        <b>
          <span style={{ fontSize: "12pt" }}>
            BALAÚSTRE Nº{" "}
            <input
              type="number"
              name="numero_balaustre"
              size="4"
              min="1"
              required
              value={form.numero_balaustre}
              onChange={handleInputChange}
              disabled={readOnly}
            />{" "}
            /EM2025-2026
          </span>
        </b>
      </p>
      <p className="mso-title" style={{ lineHeight: "1.8" }}>
        <b>
          <span style={{ fontSize: "12pt" }}>
            SESSÃO{" "}
            <select
              name="classe_sessao_titulo"
              required
              value={form.classe_sessao_titulo}
              onChange={handleInputChange}
              disabled={readOnly}
            >
              <option value="">Selecione</option>
              <option value="MAGNA">MAGNA</option>
              <option value="ORDINÁRIA">ORDINÁRIA</option>
              <option value="EXTRAORDINÁRIA">EXTRAORDINÁRIA</option>
            </select>
          </span>
        </b>
      </p>
      <p
        className="mso-title"
        style={{ lineHeight: "1.5", marginBottom: "10mm" }}
      >
        <b>
          <span style={{ fontSize: "12pt" }}>À GL∴ DO SUPR∴ ARQ∴ DO UNIV∴</span>
        </b>
      </p>

      <p className="mso-normal" style={{ textAlign: "justify" }}>
        Precisamente às{" "}
        <input
          type="time"
          style={{ width: "80px" }}
          name="hora_inicio_sessao"
          required
          value={form.hora_inicio_sessao}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        do dia{" "}
        <input
          type="date"
          style={{ width: "120px" }}
          name="dia_sessao"
          required
          value={form.dia_sessao}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        da E∴ V∴, a Augusta, Respeitável e Benfeitora Loja Simbólica João Pedro
        Junqueira n° 2181, jurisdicionada ao Grande Oriente do Estado de Goiás,
        federada ao Grande Oriente do Brasil, reuniu-se em seu Templo, sito à
        Avenida 9 – Área A-2, Conjunto Mirage, Oriente de Anápolis, Goiás, em
        Sessão{" "}
        <InputAjustavel
          name="tipo_sessao_corpo"
          required
          value={form.tipo_sessao_corpo}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <InputAjustavel
          name="subtipo_sessao_corpo"
          required
          value={form.subtipo_sessao_corpo}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        , com{" "}
        <input
          type="number"
          name="numero_irmaos_quadro"
          min="1"
          required
          size="3"
          value={form.numero_irmaos_quadro}
          onChange={handleInputChange}
          disabled={readOnly}
        />{" "}
        irmãos do quadro e
        <input
          type="number"
          name="numero_visitantes"
          min="0"
          required
          size="3"
          value={form.numero_visitantes}
          onChange={handleInputChange}
          disabled={readOnly}
        />{" "}
        irmãos visitantes, ficando a Loja assim constituída:
        <b> V∴ Mestre </b>{" "}
        <InputAjustavel
          name="veneravel"
          required
          value={form.veneravel}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        ;<b> 1° Vig∴ </b>{" "}
        <InputAjustavel
          name="primeiro_vigilante"
          required
          value={form.primeiro_vigilante}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        ;<b> 2° Vig∴ </b>{" "}
        <InputAjustavel
          name="segundo_vigilante"
          required
          value={form.segundo_vigilante}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        ;<b> Orad∴ </b>{" "}
        <InputAjustavel
          name="orador"
          required
          value={form.orador}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        ;<b> Secr∴ </b>{" "}
        <InputAjustavel
          name="secretario"
          required
          value={form.secretario}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        ;<b> Tes∴ </b>{" "}
        <InputAjustavel
          name="tesoureiro"
          required
          value={form.tesoureiro}
          onChange={handleInputChange}
          disabled={readOnly}
        />{" "}
        e<b> Chanc∴ </b>{" "}
        <InputAjustavel
          name="chanceler"
          required
          value={form.chanceler}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        , sendo os demais cargos preenchidos pelos seus titulares ou Irmãos do
        Quadro.
        <br />
        <b style={{ textAlign: "left" }}>Balaústre:</b>{" "}
        <TextareaAjustavel
          name="balaustre_anterior"
          style={{ width: "100%" }}
          required
          rows="1"
          value={form.balaustre_anterior}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <b style={{ textAlign: "left" }}>Expediente Recebido:</b>
        <br />
        <TextareaAjustavel
          name="expediente_recebido"
          style={{ width: "100%" }}
          required
          rows="1"
          value={form.expediente_recebido}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <b>
          <span style={{ textAlign: "left" }}>Expediente Expedido:</span>
        </b>
        <br />
        <TextareaAjustavel
          name="expediente_expedido"
          style={{ width: "100%" }}
          required
          rows="1"
          value={form.expediente_expedido}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <b>
          <span style={{ textAlign: "left" }}>
            Saco de Propostas e Informações
          </span>
        </b>
        <br />
        <TextareaAjustavel
          name="saco_proposta"
          style={{ width: "100%" }}
          required
          rows="1"
          value={form.saco_proposta}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <br />
        <b>Ordem do Dia</b>: <br />
        <TextareaAjustavel
          name="ordem_dia"
          style={{ width: "100%" }}
          rows="1"
          required
          value={form.ordem_dia}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <b>Escrutínio Secreto</b>: <br />
        <TextareaAjustavel
          name="escrutinio"
          style={{ width: "100%" }}
          rows="1"
          required
          value={form.escrutinio}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <b>Tempo de Instrução:</b>{" "}
        <InputAjustavel
          name="tempo_instrucao"
          rows="1"
          required
          value={form.tempo_instrucao}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        .<b>Tronco de Beneficência:</b> Fez o seu giro habitual pelo ir∴
        Hospitaleiro, sendo entregue o seu produto ao ir∴ Tesoureiro para
        conferência e, no momento oportuno, foi anunciada a medalha cunhada de
        R${" "}
        <input
          type="number"
          min="0"
          step="0.01"
          name="tronco_beneficencia"
          size="6"
          required
          value={form.tronco_beneficencia}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        <br />
        <b style={{ textAlign: "left" }}>
          {" "}
          Palavra a Bem da Ordem em Geral e do Quadro em Particular
        </b>
        : <br />
        <TextareaAjustavel
          name="palavra"
          rows="1"
          style={{ width: "100%" }}
          required
          value={form.palavra}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        .<b>Encerramento:</b> o Ven∴ Mestre encerrou a sessão às{" "}
        <input
          type="time"
          style={{ width: "80px" }}
          name="hora_encerramento"
          required
          value={form.hora_encerramento}
          onChange={handleInputChange}
          disabled={readOnly}
        />
        , tendo eu, Secretário, lavrado o presente balaústre, que depois de
        lido, se achado em tudo conforme, será assinado.
      </p>

      <p
        className="mso-normal"
        style={{ textAlign: "justify", lineHeight: "1.5" }}
      >
        <TextareaAjustavel
          name="emendas"
          rows="1"
          style={{ width: "100%" }}
          placeholder="Emendas adicionais..."
          value={form.emendas}
          onChange={handleInputChange}
          disabled={readOnly}
        />
      </p>

      <p className="mso-normal" style={{ textAlign: "right" }}>
        Oriente de Anápolis,{" "}
        <input
          type="date"
          name="data_assinatura"
          required
          value={form.data_assinatura}
          onChange={handleInputChange}
          disabled={readOnly}
        />{" "}
        – E∴ V∴
      </p>

      <table className="officers-table">
        <tbody>
          <tr>
            <td style={{ width: "33%", textAlign: "center", border: "none" }}>
              <div className="signature-placeholder">
                Assinatura do Secretário
                <br />
                <InputAjustavel
                  name="secretario_nome"
                  style={{ width: "90%" }}
                  placeholder="Nome do Secretário"
                  required
                  value={form.secretario_nome}
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
              </div>
            </td>
            <td style={{ width: "33%", textAlign: "center", border: "none" }}>
              <div className="signature-placeholder">
                Assinatura do Orador
                <br />
                <InputAjustavel
                  name="orador_nome"
                  style={{ width: "90%" }}
                  placeholder="Nome do Orador"
                  required
                  value={form.orador_nome}
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
              </div>
            </td>
            <td style={{ width: "33%", textAlign: "center", border: "none" }}>
              <div className="signature-placeholder">
                Assinatura do Ven∴ Mestre
                <br />
                <InputAjustavel
                  name="veneravel_nome"
                  style={{ width: "90%" }}
                  placeholder="Nome do Ven∴ Mestre"
                  required
                  value={form.veneravel_nome}
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="submit-area">
        <button type="submit" disabled={isSubmitting || readOnly}>
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
