import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BookmarkContext } from '../context/BookmarkContext';
import { BASE_URL } from '../services/api';

const BookmarkList = () => {
  // const [bookmarkList, setBookmarkList] = useState([]);
  const { bookmarkList, setBookmarkList } = useContext(BookmarkContext);
  const [error, setError] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [chapterNames, setChapterNames] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get(BASE_URL+'/api/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((response) => {
          console.log('Fetched bookmarks:', response.data); // Memeriksa data API
          setBookmarkList(response.data);  // Menyimpan data ke state
          // Simpan data ke localStorage
          console.log(bookmarkList)
          localStorage.setItem('bookmarkList', JSON.stringify(response.data));
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
        .post(BASE_URL+'/api/audio_files/', { "verse_keys": bookmarkList.map(bookmark => bookmark.verseKey) })
        .then((response) => {
          const af = response.data.urls || [];
          setAudioFiles(af);
        })
        .catch((error) => {
          console.error('Error fetching audio files:', error.message);
          setError('Terjadi kesalahan saat mengambil data audio.');
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
    const updatedBookmarks = bookmarkList.filter((bookmark) => bookmark._id !== _id);
    console.log(bookmarkList)
    console.log(_id)
    setBookmarkList(updatedBookmarks);  // Update state dengan data yang sudah diperbarui
    // Simpan perubahan ke localStorage
    localStorage.setItem('bookmarkList', JSON.stringify(updatedBookmarks));
    // Bisa juga mengirimkan request ke API untuk menghapus bookmark di backend
    axios
      .delete(BASE_URL+`/api/bookmarks/${_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        console.log('Bookmark removed');
      })
      .catch((error) => {
        console.error('Error removing bookmark:', error.message);
        setError('Terjadi kesalahan saat mengambil data audio.');
      });
  };

  const getChapterNameAndVerse = async (verseKey) => {
    const [chapter, verse] = verseKey.split(':');
    try {
      const res = await fetch("/assets/quran_id.json");
      const result = await res.json();
      return `Surah ${result[chapter - 1].transliteration}, Ayat ${verse}`;
    } catch (err) {
      console.error(err.message);
      return undefined;
    }
  }

  const updateAudioFiles = async () => {
    await axios
      .post(BASE_URL+'/api/audio_files/', { "verse_keys": bookmarkList.map(bookmark => bookmark.verseKey) })
      .then((response) => {
        const af = response.data.urls || [];
        setAudioFiles(af);
      })
      .catch((error) => {
        console.error('Error fetching audio files:', error.message);
        setError('Terjadi kesalahan saat mengambil data audio.');
      });
  }

  const playAudio = (verseKey) => {
    if (audioFiles.length !== bookmarkList.length || audioFiles.find((audio) => audio.verse_key === verseKey) === undefined) {
      updateAudioFiles();
      if (audioFiles.length === 0) {
        console.log('No audio files available');
        return;
      }
    }
    const audioUrl = audioFiles.find((audio) => audio.verse_key === verseKey)?.audio_url;
    console.log('Playing audio:', audioUrl);
    console.log(audioFiles);
    const fullAudioUrl = audioUrl;
    const audio = new Audio(fullAudioUrl);
    audio.play()
      .then(() => {
        console.log('Audio playing');
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
      });
  };
  // Mengambil data bookmark dari localStorage saat komponen pertama kali di-render
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarkList');
    if (storedBookmarks) {
      setBookmarkList(JSON.parse(storedBookmarks));
    }
  }, []);

  useEffect(() => {
    const fetchChapterNames = async () => {
      const names = {};
      for (const bookmark of bookmarkList) {
        const chapterName = await getChapterNameAndVerse(bookmark.verseKey);
        names[bookmark.verseKey] = chapterName;
      }
      setChapterNames(names);
    };

    fetchChapterNames();
    updateAudioFiles();
  }, [bookmarkList]);

  return (
    <div>
      <h2>Daftar Bookmark</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {bookmarkList.length === 0 ? (
        <p>Tidak ada bookmark.</p>
      ) : (
        <ul>
          {bookmarkList.map((bookmark, index) => {
            const chapterName = chapterNames[bookmark.verseKey];
            // Gabungkan verseKey dan index untuk memastikan key unik
            const uniqueKey = `${bookmark.verseKey}-${index}`;

            return (
              <li key={uniqueKey} style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "white" }}>{chapterName || 'Nama Surah Tidak Tersedia'}</strong> -
                  <div style={{ maxWidth: "800px", marginRight: "10%", marginLeft: "10%", fontSize: "26px", color: "white" }}>{bookmark.text || 'Teks Ayat Tidak Tersedia'}</div>
                </div>
                {/* Menambahkan elemen audio jika ada */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    id='lala'
                    onClick={() => playAudio(bookmark.verseKey)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Play Audio
                  </button>

                  <button
                    onClick={() => handleUnbookmark(bookmark._id)}
                    style={{
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
