// src/pages/SurahPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SurahPage({ addBookmark }) {
    const [currentSurah, setCurrentSurah] = useState(1);
    const [surahVerses, setSurahVerses] = useState([]);
    const [surahAudio, setSurahAudio] = useState([]);
    const [error, setError] = useState(null); // State untuk error

    // Fetch data untuk surah dan audio
    useEffect(() => {
        axios.get(`https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=${currentSurah}&per_page=7`)
            .then(response => {
                setSurahVerses(response.data.verses || []);
            })
            .catch(error => {
                console.error('Error fetching verses:', error);
                setError('Gagal mengambil data ayat.');
            });

        axios.get(`https://api.quran.com/api/v4/recitations/2/by_chapter/${currentSurah}?per_page=7`)
            .then(response => {
                setSurahAudio(response.data.audio_files || []);
            })
            .catch(error => {
                console.error('Error fetching audio:', error);
                setError('Gagal mengambil data audio.');
            });
    }, [currentSurah]);

    // Fungsi untuk memutar audio saat tombol diklik
    const playAudio = (audioUrl) => {
        const fullAudioUrl = `https://verses.quran.com/${audioUrl}`;
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
        if (currentSurah < 114) {
            setCurrentSurah(prevSurah => prevSurah + 1);
        }
    };

    return (
        <div>
            <h2>Surah {currentSurah}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Tampilkan error jika ada */}
            {surahVerses.map((verse, index) => (
                <div key={verse.id} style={{ marginBottom: '20px' }}>
                    <p><strong>{verse.verse_key}:</strong> {verse.text_indopak}</p>
                    {verse.translation && <p><em>Terjemahan: {verse.translation}</em></p>}
                    {/* Tombol Play Audio */}
                    <button onClick={() => playAudio(surahAudio[index]?.url)}>
                        Play Audio
                    </button>
                    {/* Tombol Bookmark */}
                    <button onClick={() => addBookmark(verse.verse_key, verse.text_indopak, verse.translation, `Surah ${currentSurah}`)}>
                        Bookmark
                    </button>
                </div>
            ))}
            
            {/* Tombol Next Surah */}
            <button onClick={nextSurah}>Next Surah</button>
        </div>
    );
}

export default SurahPage;
