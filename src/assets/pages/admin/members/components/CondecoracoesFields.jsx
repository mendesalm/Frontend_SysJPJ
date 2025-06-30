import React from 'react';
import { useFieldArray } from 'react-hook-form';

const CondecoracoesFields = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'condecoracoes',
  });

  return (
    <fieldset className="form-fieldset">
      <legend>Condecorações</legend>
      {fields.map((item, index) => (
        <div key={item.id} className="form-grid condecoracao-item">
          <div className="form-group">
            <label>Título</label>
            <input
              {...register(`condecoracoes.${index}.titulo`)}
              className={`form-input ${errors.condecoracoes?.[index]?.titulo ? 'is-invalid' : ''}`}
            />
            {errors.condecoracoes?.[index]?.titulo && (
              <p className="form-error-message">{errors.condecoracoes[index].titulo.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Data de Recebimento</label>
            <input
              type="date"
              {...register(`condecoracoes.${index}.dataRecebimento`)}
              className={`form-input ${errors.condecoracoes?.[index]?.dataRecebimento ? 'is-invalid' : ''}`}
            />
            {errors.condecoracoes?.[index]?.dataRecebimento && (
              <p className="form-error-message">{errors.condecoracoes[index].dataRecebimento.message}</p>
            )}
          </div>
          <div className="form-group full-width">
            <label>Observações</label>
            <textarea
              {...register(`condecoracoes.${index}.observacoes`)}
              className="form-input"
            ></textarea>
          </div>
          <button type="button" onClick={() => remove(index)} className="btn btn-danger">Remover</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ titulo: '', dataRecebimento: '', observacoes: '' })} className="btn btn-primary">
        Adicionar Condecoração
      </button>
    </fieldset>
  );
};

export default CondecoracoesFields;