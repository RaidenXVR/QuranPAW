import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function SurahList({ surahs }) {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const onSurahClicked = (surahId) => {
        navigate(`/surah/${surahId}`); // Navigate to the Surah page with the surahId
    };
    return (
        <div className='surah-list'>
            {surahs.map((surah, index) => (
                <div className='surah-item' key={surah.id} onClick={() => onSurahClicked(surah.id)}>
                    <div className="surah-header">
                        <span className="surah-number">{surah.id}</span>
                        <span className="surah-name">{surah.transliteration}</span>
                        <span className="surah-translation"> {surah.translation}</span>
                    </div>
                    <div className="surah-details">
                        <span className="surah-place"> {surah.type === "meccan" ? "Makkiyah" : "Madaniyah"} ‎ ‎  </span>
                        <span className="surah-ayah">  {`${surah.total_verses} Ayat`}</span>
                        <span className="surah-arabic"> {surah.name}</span>
                    </div>
                </div>
            ))}

        </div>
    )

}

export default SurahList
