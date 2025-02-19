// meeting-place-api/routes/places.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Place = require('../models/Place');
const auth = require('../middleware/auth');

// GET /api/places - Obtenir tous les lieux
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/places/search - Rechercher des lieux avec Google Places API
router.get('/search', async (req, res) => {
  const { query, location, types } = req.query;
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    
    const params = {
      key: process.env.GOOGLE_MAPS_API_KEY,
      radius: 2000,
      language: 'fr'
    };

    // Définir les types exacts pour chaque catégorie
    const typeMapping = {
      restaurant: { type: 'restaurant', excludeTypes: ['cafe', 'bar'] },
      cafe: { type: 'cafe', excludeTypes: ['restaurant', 'bar'] },
      bar: { type: 'bar', excludeTypes: ['restaurant', 'cafe'] },
      park: { type: 'park', excludeTypes: [] }
    };

    // Vérifier et formater la location
    if (location) {
      const [lat, lng] = location.split(',');
      params.location = `${lat},${lng}`;
    }

    if (query) {
      params.keyword = query;
    }

    if (types) {
      const selectedType = types.split(',')[0];
      params.type = typeMapping[selectedType].type;
    }

    console.log('Recherche avec paramètres:', params);

    const response = await axios.get(url, { params });
    
    let results = response.data.results;

    // Vérifier que chaque résultat a une géométrie valide
    results = results.filter(place => 
      place.geometry && 
      place.geometry.location && 
      typeof place.geometry.location.lat === 'number' && 
      typeof place.geometry.location.lng === 'number'
    );

    // Filtrer plus strictement par type
    if (types) {
      const selectedType = types.split(',')[0];
      const { type: exactType, excludeTypes } = typeMapping[selectedType];
      results = results.filter(place => {
        // Vérifier que le lieu a le bon type et n'a pas les types exclus
        return place.types.includes(exactType) && 
          !excludeTypes.some(excludeType => place.types.includes(excludeType));
      });
    }

    if (results.length === 0) {
      console.log('Aucun résultat trouvé');
    } else {
      console.log(`${results.length} résultats trouvés avec géométrie valide`);
    }

    // Supprimer les doublons basés sur place_id
    results = Array.from(new Map(results.map(place => [place.place_id, place])).values());

    // Limiter aux 15 meilleurs résultats
    results = results.slice(0, 15);

    // Log des coordonnées pour vérification
    results.forEach(place => {
      console.log(`${place.name}: ${place.geometry.location.lat}, ${place.geometry.location.lng}`);
    });

    res.json(results);
  } catch (err) {
    console.error('Erreur API Places:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/places - Créer un nouveau lieu
router.post('/', auth, async (req, res) => {
  const place = new Place({
    name: req.body.name,
    address: req.body.address,
    geometry: {
      type: 'Point',
      coordinates: [req.body.lng, req.body.lat]
    },
    category: req.body.category,
    createdBy: req.user.id
  });

  try {
    const newPlace = await place.save();
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Ajouter cette route pour obtenir les détails d'un lieu
router.get('/details', async (req, res) => {
  const { placeId } = req.query;
  
  if (!placeId) {
    return res.status(400).json({ message: 'Le paramètre placeId est requis' });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
          fields: 'name,rating,formatted_phone_number,opening_hours,user_ratings_total,photos,website,reviews,price_level,formatted_address',
          language: 'fr'
        }
      }
    );

    console.log('Détails du lieu reçus:', response.data.result);
    res.json(response.data.result);
  } catch (err) {
    console.error('Erreur API Places Details:', err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;