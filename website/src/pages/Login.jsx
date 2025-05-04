// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('https://discord.com/oauth2/authorize?client_id=1363531532127437003&response_type=code&redirect_uri=https%3A%2F%2Foctra-bot.vercel.app%2F&scope=identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Token speichern
      localStorage.setItem('token', data.token);
      navigate('/profile'); // Umleitung nach dem Login
    } else {
      setError(data.message || 'Etwas ist schief gelaufen');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Einloggen</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;