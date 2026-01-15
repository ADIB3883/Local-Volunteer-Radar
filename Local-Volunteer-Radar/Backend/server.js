const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const loginRoutes = require('./routes/loginRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { dbName: 'TestingDB' })
    .then(() => console.log('✅ MongoDB connected successfully to TestingDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api', loginRoutes);

app.get('/', (req, res) => {
    res.json({ message: '✅ Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});