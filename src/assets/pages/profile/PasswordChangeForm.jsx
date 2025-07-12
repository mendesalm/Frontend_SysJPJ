import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const passwordChangeSchema = yup.object().shape({
  currentPassword: yup.string().required('A senha atual é obrigatória.'),
  newPassword: yup.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.').required('A nova senha é obrigatória.'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'As senhas não correspondem.').required('A confirmação da nova senha é obrigatória.'),
});

const PasswordChangeForm = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(passwordChangeSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="form-fieldset">
        <legend>Alterar Senha</legend>
        <div className="form-group">
          <label>Senha Atual</label>
          <input
            type="password"
            {...register('currentPassword')}
            className={`form-input ${errors.currentPassword ? 'is-invalid' : ''}`}
          />
          {errors.currentPassword && <p className="form-error-message">{errors.currentPassword.message}</p>}
        </div>
        <div className="form-group">
          <label>Nova Senha</label>
          <input
            type="password"
            {...register('newPassword')}
            className={`form-input ${errors.newPassword ? 'is-invalid' : ''}`}
          />
          {errors.newPassword && <p className="form-error-message">{errors.newPassword.message}</p>}
        </div>
        <div className="form-group">
          <label>Confirmar Nova Senha</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
          />
          {errors.confirmPassword && <p className="form-error-message">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'A alterar...' : 'Alterar Senha'}
        </button>
      </fieldset>
    </form>
  );
};

export default PasswordChangeForm;
