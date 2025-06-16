// src/assets/pages/templates/TemplateEditor.jsx
import React, { useState, useMemo } from "react";
import "../../../assets/styles/FormStyles.css"; // Reutilizando estilos

const TemplateEditor = ({ template, placeholders, onSave, onCancel }) => {
  const [assunto, setAssunto] = useState(template.assunto);
  // Para o corpo, usamos um <textarea> simples. Uma biblioteca de Rich Text pode ser adicionada no futuro.
  const [corpo, setCorpo] = useState(template.corpo);

  // Filtra os placeholders disponíveis para o gatilho deste template específico
  const availablePlaceholders = useMemo(() => {
    return placeholders[template.eventoGatilho] || [];
  }, [template, placeholders]);

  const handleSaveClick = () => {
    onSave(template.id, { assunto, corpo });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Poderíamos adicionar um toast de sucesso aqui
  };

  return (
    <div className="form-container">
      <div className="form-group">
        <label htmlFor="assunto">Assunto do E-mail</label>
        <input
          id="assunto"
          type="text"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="corpo">Corpo do E-mail (suporta HTML)</label>
        <textarea
          id="corpo"
          value={corpo}
          onChange={(e) => setCorpo(e.target.value)}
          className="form-textarea"
          rows="15"
        />
      </div>

      <div className="placeholders-info" style={{ marginTop: "1rem" }}>
        <strong>Placeholders Disponíveis:</strong>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
          {availablePlaceholders.map((p) => (
            <li
              key={p.placeholder}
              style={{
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <code
                onClick={() => copyToClipboard(p.placeholder)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#374151",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                title="Clique para copiar"
              >
                {p.placeholder}
              </code>
              <span>- {p.description}</span>
            </li>
          ))}
        </ul>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--cor-texto-secundario)",
          }}
        >
          Clique em um placeholder para copiá-lo e cole no assunto ou corpo do
          e-mail.
        </p>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="btn btn-primary"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default TemplateEditor;
