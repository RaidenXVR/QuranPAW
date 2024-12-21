import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookmarks';
const AUTH_URL = 'http://localhost:5000/api/auth';  // URL untuk auth

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

export const getBookmarks = () => {
    const token = localStorage.getItem('token');  // Mengambil token dari localStorage

    // Jika token ada, sertakan dalam header Authorization
    if (token) {
        return axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,  // Menambahkan header Authorization dengan token
            },
        });
    } else {
        // Jika token tidak ada, kembalikan promise yang ditolak
        return Promise.reject('User is not authenticated');
    }
};

// Fungsi untuk menambahkan bookmark baru
export const addBookmark = (verseKey, text, translation) => {
    const token = getToken();  // Mengambil token dari localStorage

    if (token) {
        // Jika token ada, sertakan dalam header Authorization
        return axios.post(API_URL, { verseKey, text, translation }, {
            headers: {
                Authorization: `Bearer ${token}`,  // Menambahkan header Authorization dengan token
            },
        }).catch((error) => {
            // Menangani error saat menambahkan bookmark
            console.error('Error adding bookmark:', error);
            throw new Error('Gagal menambahkan bookmark');
        });
    } else {
        // Jika token tidak ada, kembalikan promise yang ditolak
        return Promise.reject('User is not authenticated');
    }
};

export const deleteBookmark = (_id) => {
    const token = getToken();

    if (token) {
        return axios.delete(API_URL + `/${_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((err) => {
            console.error("Error deleting bookmark", err.message);
            throw new Error('Gagal menghapus bookmark')
        })
    }
}

// Fungsi untuk login pengguna
export const loginUser = (email, password) => {
    return axios.post(`${AUTH_URL}/login`, { email, password })
        .then(response => {
            // Menyimpan token ke localStorage jika login berhasil
            localStorage.setItem('token', response.data.token);
            return response.data;  // Mengembalikan response yang berisi token
        })
        .catch(error => {
            // Menangani error saat login gagal
            console.error('Login failed:', error);
            throw new Error(error.response ? error.response.data.message : 'Login failed');
        });
};

// Fungsi untuk registrasi pengguna
export const registerUser = (email, password) => {
    return axios.post(`${AUTH_URL}/register`, { email, password })
        .then(response => {
            return response.data;  // Mengembalikan data dari server setelah registrasi berhasil
        })
        .catch(error => {
            // Menangani error saat registrasi gagal
            console.error('Registration failed:', error);
            if (error.response) {
                throw new Error(error.response.data.message || 'Terjadi kesalahan saat registrasi');
            } else if (error.request) {
                throw new Error('Tidak ada respons dari server');
            } else {
                throw new Error('Terjadi kesalahan dalam proses registrasi');
            }
        });
};

// Fungsi untuk logout pengguna
export const logoutUser = () => {
    localStorage.removeItem('token');  // Menghapus token dari localStorage
    // Redirect ke halaman login setelah logout
    window.location.href = '/login';
};
