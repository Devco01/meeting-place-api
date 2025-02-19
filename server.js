require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://meeting-place-finder.vercel.app']
}));
app.use(express.json());

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Meeting Place API is running',
    endpoints: {
      places: '/api/places',
      auth: '/api/auth'
    }
  });
});

// Routes
const authRoutes = require('./routes/auth');
const placesRoutes = require('./routes/places');

app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);

// Connection à la base de données
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Pour Vercel
module.exports = app;