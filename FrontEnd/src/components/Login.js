import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Mengirim permintaan POST ke server untuk login
      const response = await axios.post(BASE_URL + '/api/login', {
        email,
        password,
      });

      const { token } = response.data; // Asumsi server mengirimkan token dalam response

      // Menyimpan token ke localStorage
      localStorage.setItem('token', token);

      alert('Login berhasil!');
      navigate('/bookmarks'); // Redirect ke halaman bookmarks setelah login
    } catch (error) {
      console.log(err.message)
      alert('Login gagal. Cek kembali email atau password Anda.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Belum punya akun? <a href="/register">Daftar di sini</a>
      </p>
    </div>
  );
};

export default Login;
