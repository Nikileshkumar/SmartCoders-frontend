// Login.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { API_BASE_URL } from '../constants';

function Login() {
  const navigate = useNavigate();
  const [rmId, setRmId] = useState('');
  const [rmName, setRmName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (rmId && password) {
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username: rmId,
          password,
        });

        const { name,role } = response.data;
         localStorage.setItem('rmId', rmId);
        localStorage.setItem('rmName', name);
        localStorage.setItem('userRole', role);

        if (role === 'ADMIN') {
          navigate('/journeys');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="rmId">Username</label>
      <input
        id="rmId"
        type="text"
        value={rmId}
        onChange={(e) => setRmId(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} aria-label="Login">Login</button>
    </div>
  );
}

export default Login;
