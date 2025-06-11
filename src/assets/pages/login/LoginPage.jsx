import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); // Obtenha a função de login do contexto
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // A única responsabilidade do componente é chamar a função de login
      await login(email, password);
      navigate('/dashboard'); // Navega para o dashboard em caso de sucesso
    } catch (err) {
      // O tratamento de erro também é simplificado
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Falha no login. Verifique as suas credenciais.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-body-wrapper">
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <h1>Área Restrita</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            {/* <i className='bx bxs-user'></i> */}
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {/* <i className='bx bxs-lock-alt'></i> */}
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" disabled={isLoading} />Lembrar-me</label>
            <Link to="/esqueci-senha" style={{color: '#fff', textDecoration: 'none'}}>Esqueci a senha</Link>
          </div>
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && <div className="login-message login-error-message">{error}</div>}
          <div className="register-link">
            <p>Não tem uma conta? <a href="#">Solicitar cadastro</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
