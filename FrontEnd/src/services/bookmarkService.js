import axios from 'axios';

export const addBookmark = (verseKey, text, translation) => {
console.log('Mencoba menambahkan bookmark ke server', verseKey, text, translation); // Log input untuk debugging
return axios.post('quranku-backend.vercel.app/api/bookmarks', { verseKey, text, translation })
.then(response => {
      console.log('Response dari server:', response.data); // Log response dari server
      return response.data;
    })
    .catch(error => {
      console.error('Error saat menghubungi API:', error.response || error.message); // Log error lebih detail
      throw new Error('Gagal menambahkan bookmark');
    });
};
