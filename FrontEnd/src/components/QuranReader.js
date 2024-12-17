import React from 'react';

function QuranReader({ audioData, versesData }) {
    return (
        <div>
            {audioData.map((audio, index) => {
                // Mencocokkan verse_key dengan verse data
                const verse = versesData.find(v => v.key === audio.verse_key);
                
                return (
                    <div key={index}>
                        <h3>{verse ? verse.text : 'Verse not found'} - {audio.verse_key}</h3> {/* Menampilkan teks ayat */}
                        <audio controls>
                            <source src={`https://verses.quran.com/${audio.url}`} type="audio/mp3" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            })}
        </div>
    );
}

export default QuranReader;
