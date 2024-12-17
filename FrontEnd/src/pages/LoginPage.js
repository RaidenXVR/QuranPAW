// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk navigasi setelah login berhasil
import axios from 'axios'; // Untuk melakukan request ke API

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook untuk navigasi setelah login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mengirimkan request login ke backend API
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // Jika login berhasil, simpan token dan arahkan ke halaman utama
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Menyimpan token
        navigate('/'); // Arahkan ke halaman utama setelah login
      }
    } catch (error) {
      alert('Email atau password salah');
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
