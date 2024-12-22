import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './styles/Navbar.css'; // Import CSS terpisah

// Halaman
import BookmarkPage from './pages/BookmarkPage';
import SurahPage from './pages/SurahPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SurahList from './pages/SurahList';
import { getBookmarks } from './services/api';
import { AuthContext } from './context/AuthContext';
import { BookmarkContext } from './context/BookmarkContext';

function App() {
  const [error, setError] = useState(null);
  const { bookmarksList, setBookmarksList } = useContext(BookmarkContext);
  const [surahList, setSurahList] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State untuk toggle navbar
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);


  const logoutUser = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
    fetch("/assets/quran_id.json")
      .then((res) => {
        res.json().then((result) => {
          setSurahList(result)
        })
      }).catch((err) => {
        console.error(err)
      })

    getBookmarks()
      .then((response) => setBookmarksList(response.data))
      .catch(() => setError('Terjadi kesalahan saat mengambil daftar bookmark.'));

  }, [isAuthenticated]);

  return (
    <div className="App">
      {/* Navbar */}
      <header>
        <nav className="navbar">
          <div className="navbar-brand">
            <img id='logo' src="/images/logoq.png" alt="Logo" className="logo" />
            <span>Qur'an ku</span>
          </div>

          {/* Toggle Button */}
          <button className={`navbar-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </button>

          {/* Navbar Links */}
          <ul className={`navbar-actions ${isOpen ? 'active' : ''}`}>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li hidden={!isAuthenticated}><Link to="/bookmarks" className="nav-link">Bookmark</Link></li>
            <li hidden={isAuthenticated}><Link to="/login" className="nav-link">Login</Link></li>
            <li hidden={isAuthenticated}><Link to="/register" className="nav-link">Register</Link></li>
            <li hidden={!isAuthenticated}><button onClick={logoutUser} className="nav-button">Logout</button></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path='/' element={<SurahList surahs={surahList} />} />
          <Route path="/surah/:surahId" element={<SurahPage />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
