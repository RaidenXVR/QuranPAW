const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../../BackEnd/models/User');
const app = express();

// Middleware untuk parsing body JSON
app.use(express.json());

// Route untuk registrasi
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = new User({ email, password: hashedPassword });

    // Simpan user ke database
    await user.save();

    // Berikan response sukses
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// Pastikan server mendengarkan pada port yang benar
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
