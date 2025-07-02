import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { livroSchema } from "../../../validators/livroValidator";
import { searchBookByISBN } from "../../../services/bibliotecaService";
import { FaSearch } from "react-icons/fa";
import "../../../assets/styles/FormStyles.css";

const LivroForm = ({ livro, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(livroSchema),
  });

  const [searchStatus, setSearchStatus] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [capaUrl, setCapaUrl] = useState(null);

  const isbnValue = watch("isbn");

  useEffect(() => {
    if (livro) {
      reset(livro);
      if (livro.capaUrl) {
        setCapaUrl(livro.capaUrl);
      }
    }
  }, [livro, reset]);

  const handleIsbnSearch = async () => {
    if (!isbnValue) {
      setSearchStatus("Por favor, insira um ISBN para buscar.");
      return;
    }
    setIsSearching(true);
    setSearchStatus("A procurar...");
    setCapaUrl(null);
    try {
      const bookData = await searchBookByISBN(isbnValue);

      setValue("titulo", bookData.titulo, { shouldValidate: true });
      setValue("autor", bookData.autor, { shouldValidate: true });
      setValue("editora", bookData.editora, { shouldValidate: true });
      setValue("anoPublicacao", bookData.anoPublicacao, {
        shouldValidate: true,
      });
      setValue("descricao", bookData.descricao, { shouldValidate: true });

      if (bookData.capaUrl) {
        setCapaUrl(bookData.capaUrl);
      }

      setSearchStatus("Dados do livro preenchidos com sucesso!");
    } catch (error) {
      setSearchStatus(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="form-container">
      <fieldset className="form-fieldset">
        <legend>Busca Automática por ISBN</legend>
        <div className="livro-form-grid">
          <div className="isbn-search-section">
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                id="isbn"
                {...register("isbn")}
                className="form-input"
                placeholder="Digite o ISBN de 10 ou 13 dígitos"
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                onClick={handleIsbnSearch}
                className="btn btn-secondary"
                disabled={isSearching}
                style={{ alignSelf: "flex-end" }}
              >
                <FaSearch style={{ marginRight: "8px" }} />
                {isSearching ? "A buscar..." : "Buscar"}
              </button>
            </div>
            {searchStatus && (
              <p className="search-status-message">{searchStatus}</p>
            )}
          </div>
          <div className="book-cover-container">
            {capaUrl ? (
              <img
                src={capaUrl}
                alt="Capa do livro"
                className="book-cover-preview"
              />
            ) : (
              <div className="book-cover-placeholder">
                <span>Capa do Livro</span>
              </div>
            )}
          </div>
        </div>
      </fieldset>

      <div className="form-group">
        <label>Título</label>
        <input
          {...register("titulo")}
          className={`form-input ${errors.titulo ? "is-invalid" : ""}`}
        />
        {errors.titulo && (
          <p className="form-error-message">{errors.titulo.message}</p>
        )}
      </div>

      <div className="form-group">
        <label>Autor</label>
        <input
          {...register("autor")}
          className={`form-input ${errors.autor ? "is-invalid" : ""}`}
        />
        {errors.autor && (
          <p className="form-error-message">{errors.autor.message}</p>
        )}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Editora</label>
          <input {...register("editora")} className="form-input" />
        </div>
        <div className="form-group">
          <label>Ano de Publicação</label>
          <input
            type="number"
            {...register("anoPublicacao")}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          rows="4"
          {...register("descricao")}
          className="form-textarea"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Salvar Livro
        </button>
      </div>
    </form>
  );
};

export default LivroForm;
