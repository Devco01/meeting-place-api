require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});