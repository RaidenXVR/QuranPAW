// src/pages/SurahPage.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Navbar.css';
import { addBookmark, getBookmarks, deleteBookmark } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function SurahPage() {
    const [currentSurah, setCurrentSurah] = useState("");
    const [surahVerses, setSurahVerses] = useState([]);
    const [surahAudio, setSurahAudio] = useState([]);
    const [error, setError] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const { surahId } = useParams()

    const navigate = useNavigate();

    // Fetch data untuk surah dan audio
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        if (surahId === undefined) {
            navigate("/");
            return
        }
        fetch("/assets/quran_id.json")
            .then((res) => {
                if (res) {
                    res.json().then((data) => {
                        setCurrentSurah(data[surahId - 1].transliteration);
                        setSurahVerses(data[surahId - 1].verses);
                    })
                }
            }).catch((err) => {
                console.log(err)
            });
        getBookmarks().then((result) => {
            setBookmarks(result.data);
        }).catch((err) => {
            console.log(err.message)
        });

        axios.get(`http://localhost:5000/api/get_audio/${surahId}?chapter_length=300`)
            .then(response => {
                setSurahAudio(response.data.urls || []);
            })
            .catch(error => {
                console.error('Error fetching audio:', error);
                setError('Gagal mengambil data audio.');
            });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [surahId, isAuthenticated]);

    // Fungsi untuk memutar audio saat tombol diklik
    const playAudio = (audioUrl) => {
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

    // Fungsi untuk berpindah ke surah berikutnya
    const nextSurah = () => {
        const nextSurahId = parseInt(surahId) + 1; // Calculate the next Surah ID
        navigate(`/surah/${nextSurahId}`); // Navigate to the next Surah
    };

    //TODO: Ini bedain ayat surat mana sama surat lain gimana?
    const unbookmark = (verseKey) => {

        const clickedUnbookmark = bookmarks.find(bookmark => bookmark.verseKey === verseKey);
        if (clickedUnbookmark) {
            deleteBookmark(clickedUnbookmark._id).then(() => {
                setBookmarks(bookmarks.filter(bookmark => bookmark.verseKey !== verseKey));
            }
            ).catch((error) => {
                console.error(clickedUnbookmark._id);
                console.error('Error deleting bookmark:', error);
            });
        }

    }

    const addToBookmark = (verseId, text, translation) => {
        const verseKey = `${surahId}:${verseId}`;
        addBookmark(verseKey, text, translation)
            .then(() => {
                getBookmarks().then((result) => {
                    setBookmarks(result.data);
                }).catch((err) => {
                    console.log(err.message);
                })
                // console.log('Bookmark added successfully');
            })
            .catch((error) => {
                console.error('Error adding bookmark:', error);
            });
    }


    return (
        <div>
            <h2>Surah {currentSurah}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Tampilkan error jika ada */}
            {surahVerses.map((verse, index) => (
                <div className='kanan' key={verse.id} style={{ marginBottom: '20px' }}>
                    <p><strong >{verse.id}:</strong> {verse.text}</p>
                    {verse.translation && <p><em id='translet'>{verse.translation}</em></p>}
                    {/* Tombol Play Audio */}
                    <button id='lala' onClick={() => playAudio(surahAudio[index])}>
                        Play Audio
                    </button>
                    {/* Tombol Bookmark */}
                    <button hidden={!isAuthenticated} id='lala' onClick={() => {
                        if (bookmarks.some(bookmark => bookmark.verseKey === `${surahId}:${verse.id}`)) {
                            unbookmark(`${surahId}:${verse.id}`);
                            console.log('Bookmark removed');

                        } else {
                            addToBookmark(verse.id, verse.text, verse.translation);
                            console.log('Bookmark added');
                        }
                    }}>
                        {bookmarks.some(bookmark => bookmark.verseKey === `${surahId}:${verse.id}`) ? "Unbookmark" : "Bookmark"}
                    </button>
                </div>
            ))}

            {/* Tombol Next Surah */}
            <button id='lala' hidden={surahId == 114} onClick={nextSurah}>Next Surah</button>
        </div>
    );
}

export default SurahPage;
