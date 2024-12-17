// AddBookmark.js
import React, { useState } from 'react';
import axios from 'axios';

const AddBookmark = ({ onBookmarkAdded }) => {
    const [verseKey, setVerseKey] = useState('');
    const [text, setText] = useState('');
    const [translation, setTranslation] = useState('');
    const [surahName, setSurahName] = useState('');

    const handleAddBookmark = () => {
        axios.post('http://localhost:5000/api/bookmarks', { verseKey, text, translation, surahName })
            .then(response => {
                console.log('Bookmark added:', response.data);
                onBookmarkAdded(response.data); // Menambahkan bookmark ke state parent
            })
            .catch(error => {
                console.error('Error adding bookmark:', error);
            });
    };

    return (
        <div>
            <h2>Add Bookmark</h2>
            <input type="text" value={verseKey} onChange={(e) => setVerseKey(e.target.value)} placeholder="Verse Key" />
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" />
            <input type="text" value={translation} onChange={(e) => setTranslation(e.target.value)} placeholder="Translation" />
            <input type="text" value={surahName} onChange={(e) => setSurahName(e.target.value)} placeholder="Surah Name" />
            <button onClick={handleAddBookmark}>Add Bookmark</button>
        </div>
    );
};

export default AddBookmark;
