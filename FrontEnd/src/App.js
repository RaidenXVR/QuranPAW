import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';

// Halaman
import BookmarkPage from './pages/BookmarkPage';
import SurahPage from './pages/SurahPage';
import Login from './components/Login';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [verses, setVerses] = useState([]);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  // Fungsi menambahkan bookmark untuk setiap ayat
  const addBookmark = (verseKey, text, translation) => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage

  


    if (token) {
      axios
        .post(
          'http://localhost:5000/api/bookmarks',
          { verseKey, text, translation },
          { headers: { 'Authorization': `Bearer ${token}` } } // Sertakan token di header
        )
        .then((response) => {
          // Setelah bookmark ditambahkan, perbarui state bookmarks
          setBookmarks((prevBookmarks) => [...prevBookmarks, response.data]);  // Update bookmark yang sudah ditambahkan
        })
        .catch((error) => {
          console.error('Error adding bookmark:', error);
          setError('Terjadi kesalahan saat menambahkan bookmark.');
        });
    } else {
      console.error('Token tidak ditemukan');
      setError('Harap login terlebih dahulu.');
    }
  };

  // Fungsi logout
  const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect ke halaman login
  };

  // Fetch data saat komponen mount
  useEffect(() => {
    // Ambil data audio
    axios
      .get('https://api.quran.com/api/v4/recitations/2/by_chapter/1?per_page=7')
      .then((response) => {
        setAudioFiles(response.data.audio_files || []);
      })
      .catch((error) => {
        setError('Terjadi kesalahan saat mengambil data audio.');
      });

    // Ambil data ayat
    axios
      .get('https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=1&per_page=7')
      .then((response) => {
        setVerses(response.data.verses || []);
      })
      .catch((error) => {
        setError('Terjadi kesalahan saat mengambil data ayat.');
      });

    // Ambil daftar bookmark
    axios
      .get('http://localhost:5000/api/bookmarks')
      .then((response) => {
        setBookmarks(response.data);
      })
      .catch((error) => {
        setError('Terjadi kesalahan saat mengambil daftar bookmark.');
      });
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Al-Quran PWA</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bookmarks">Bookmarks</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><button onClick={logoutUser}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={<SurahPage verses={verses} audioFiles={audioFiles} addBookmark={addBookmark} />}
          />
          <Route path="/bookmarks" element={<BookmarkPage bookmarks={bookmarks} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
