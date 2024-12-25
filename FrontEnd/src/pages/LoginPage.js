import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah login berhasil
import axios from 'axios'; // Untuk melakukan request ke API
import '../styles/Login.css'; // Import CSS terpisah
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook untuk navigasi setelah login
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mengirimkan request login ke backend API
      const response = await axios.post(BASE_URL+'/api/login', {
        email,
        password,
      });

      // Jika login berhasil, simpan token dan arahkan ke halaman utama
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Menyimpan token
        navigate('/'); // Arahkan ke halaman utama setelah login
        setIsAuthenticated(true); // Set state isAuthenticated menjadi true

      }
    } catch (error) {
      alert('Email atau password salah');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              placeholder='email'
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              placeholder='password'
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;
