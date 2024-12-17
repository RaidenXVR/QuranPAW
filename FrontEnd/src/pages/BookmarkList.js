import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookmarkList = ({ bookmarks }) => {
  const [bookmarksData, setBookmarksData] = useState([]);
  const [error, setError] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:5000/api/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((response) => {
          console.log('Fetched bookmarks:', response.data); // Memeriksa data API
          setBookmarksData(response.data);  // Menyimpan data ke state
          // Simpan data ke localStorage
          localStorage.setItem('bookmarksData', JSON.stringify(response.data));
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            setError('Token tidak valid atau sudah kedaluwarsa. Harap login kembali.');
          } else {
            setError('Terjadi kesalahan saat mengambil daftar bookmark.');
          }
          console.error('Error fetching bookmarks:', error);
        });

      // Ambil data audio
      axios
        .get('https://api.quran.com/api/v4/recitations/2/by_chapter/1?per_page=7')
        .then((response) => {
          setAudioFiles(response.data.audio_files || []);
        })
        .catch((error) => {
          console.error('Error fetching audio files:', error);
        });
    } else {
      setError('Harap login terlebih dahulu.');
    }
  }, []);  // Hanya dijalankan sekali saat komponen pertama kali di-render

  // Fungsi untuk mendapatkan audio berdasarkan verseKey
  const getAudioUrlForBookmark = (verseKey) => {
    const audio = audioFiles.find((audio) => audio.verse_key === verseKey);
    return audio ? audio.audio_url : null;
  };

  // Fungsi untuk menghapus bookmark
  const handleUnbookmark = (_id) => {
    const updatedBookmarks = bookmarksData.filter((bookmark) => bookmark._id !== _id);
    console.log(bookmarksData)
    console.log(_id)
    setBookmarksData(updatedBookmarks);  // Update state dengan data yang sudah diperbarui
    // Simpan perubahan ke localStorage
    localStorage.setItem('bookmarksData', JSON.stringify(updatedBookmarks));
    // Bisa juga mengirimkan request ke API untuk menghapus bookmark di backend
    axios
      .delete(`http://localhost:5000/api/bookmarks/${_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        console.log('Bookmark removed');
      })
      .catch((error) => {
        console.error('Error removing bookmark:', error);
      });
  };

  // Mengambil data bookmark dari localStorage saat komponen pertama kali di-render
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarksData');
    if (storedBookmarks) {
      setBookmarksData(JSON.parse(storedBookmarks));
    }
  }, []);

  return (
    <div>
      <h2>Daftar Bookmark</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookmarksData.length === 0 ? (
        <p>Tidak ada bookmark.</p>
      ) : (
        <ul>
          {bookmarksData.map((bookmark, index) => {
            const audioUrl = getAudioUrlForBookmark(bookmark.verseKey);

            // Gabungkan verseKey dan index untuk memastikan key unik
            const uniqueKey = `${bookmark.verseKey}-${index}`;

            return (
              <li key={uniqueKey}>
                <strong>{bookmark.verseKey || 'Nama Surah Tidak Tersedia'}</strong> -
                {bookmark.text || 'Teks Ayat Tidak Tersedia'}

                {/* Menambahkan elemen audio jika ada */}
                {audioUrl && (
                  <div>
                    <audio controls>
                      <source src={audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Tombol Unbookmark */}
                <button
                  onClick={() => handleUnbookmark(bookmark._id)}
                  style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Unbookmark
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
