// src/assets/pages/admin/members/components/PersonalDataFields.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../../../../../services/apiClient";
import PlaceholderAvatar from "../../../../images/avatar_placeholder.png"; // Imagem de placeholder

const PersonalDataFields = ({ register, errors, watch, initialPhoto }) => {
  const [preview, setPreview] = useState(null);
  const photoFile = watch("FotoPessoal");

  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [photoFile]);

  const getFileUrl = (path) => {
    if (!path) return PlaceholderAvatar;
    const baseURL = apiClient.defaults.baseURL.startsWith("http")
      ? apiClient.defaults.baseURL
      : window.location.origin;
    return `${baseURL}/${path}`.replace("/api/", "/");
  };

  const currentImage =
    preview || (initialPhoto ? getFileUrl(initialPhoto) : PlaceholderAvatar);

  return (
    <fieldset className="form-fieldset">
      <legend>Dados Pessoais</legend>
      <div className="form-grid">
        <div className="profile-photo-section">
          <img
            src={currentImage}
            alt="Foto do Membro"
            className="profile-photo-preview"
          />
          <div className="form-group">
            <label htmlFor="FotoPessoal">Foto do Perfil (Opcional)</label>
            <input
              type="file"
              id="FotoPessoal"
              {...register("FotoPessoal")}
              className="form-input"
              accept="image/jpeg, image/png, image/gif, image/webp"
            />
            {errors.FotoPessoal && (
              <p className="form-error-message">{errors.FotoPessoal.message}</p>
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <label>Nome Completo</label>
          <input
            type="text"
            {...register("NomeCompleto")}
            className={`form-input ${errors.NomeCompleto ? "is-invalid" : ""}`}
          />
          {errors.NomeCompleto && (
            <p className="form-error-message">{errors.NomeCompleto.message}</p>
          )}
        </div>
        {/* ... resto dos campos ... */}
      </div>
    </fieldset>
  );
};

export default PersonalDataFields;
