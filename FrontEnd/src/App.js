import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/Navbar.css'; // Import CSS terpisah

// Halaman
import BookmarkPage from './pages/BookmarkPage';
import SurahPage from './pages/SurahPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SurahList from './pages/SurahList';
import { getBookmarks } from './services/api';

function App() {
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [surahList, setSurahList] = useState([]);


  const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetch("/assets/quran_id.json")
      .then((res) => {
        res.json().then((result) => {
          setSurahList(result)
        })
      }).catch((err) => {
        console.error(err)
      })

    getBookmarks()
      .then((response) => setBookmarks(response.data))
      .catch(() => setError('Terjadi kesalahan saat mengambil daftar bookmark.'));
  }, []);
  return (
    <div className="App">
      {/* Navbar */}
      <header>
        <nav className="navbar">
          {/* Logo dan Nama Aplikasi di Kiri */}

          <div className="navbar-brand">
            <img id='logo' src="/images/logoq.png" alt="Al-Quran PWA Logo" className="logo" />
            Qur'an ku</div>




          {/* Login/Register/Logout di Kanan */}
          <ul className="navbar-actions">
            <li>
              <a href="/" className="nav-link">Home</a>
            </li>
            <li>
              <a href="/login" className="nav-link">Login</a>
            </li>
            <li>
              <a href="/register" className="nav-link">Register</a>
            </li>
            <li>
              <button onClick={logoutUser} className="nav-button">Logout</button>
            </li>
            <li>
              <button onClick={() => console.log(surahList)} className='nav-button'>Debug</button>
            </li>
          </ul>
        </nav>
      </header>









      {/* Main Content */}
      <main>
        <Routes>
          <Route path='/' element={<SurahList surahs={surahList} />} />
          <Route path="/surah/:surahId" element={<SurahPage />} />
          <Route path="/bookmarks" element={<BookmarkPage bookmarks={bookmarks} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


