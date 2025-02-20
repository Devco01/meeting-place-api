require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Configuration CORS améliorée
app.use(cors({
  origin: ['http://localhost:3000', 'https://meeting-place-finder.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Changé à false car nous n'utilisons pas de cookies
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

// Ajout d'un gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(500).json({ 
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;