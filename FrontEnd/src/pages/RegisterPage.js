import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // Import CSS terpisah

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = { username, email, password };

    axios.post('http://localhost:5000/api/register', userData)
      .then(response => {
        console.log('User registered successfully', response.data);
      })
      .catch(error => {
        setError('Network error occurred');
        console.error('Error during registration:', error);
      });
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
