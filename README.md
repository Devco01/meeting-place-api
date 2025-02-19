# Meeting Place API - Backend

API Node.js/Express pour la recherche de lieux de rencontre utilisant l'API Google Places.

## 🛠️ Technologies utilisées

- Node.js & Express
- MongoDB avec Mongoose
- Google Places API
- JWT pour l'authentification

## 📚 API Endpoints

### Places

#### `GET /api/places/search`
Recherche des lieux selon les critères fournis.
- **Paramètres** :
  - `location` : `string` (format: "latitude,longitude")
  - `types` : `string` (restaurant, cafe, bar, park)
  - `query` : `string` (optionnel) - terme de recherche

#### `GET /api/places/details`
Obtient les détails d'un lieu spécifique.
- **Paramètres** :
  - `placeId` : `string` - ID Google Places du lieu


## 📝 Notes

- Les requêtes sont limitées selon les quotas de l'API Google Places
- CORS est configuré pour accepter les requêtes du frontend (http://localhost:3000)
- Les réponses sont mises en cache pour optimiser les performances

## 🔐 Sécurité

- Les clés API sont stockées dans les variables d'environnement
- Les requêtes sont validées avant d'être traitées
- Protection contre les attaques courantes (XSS, injection, etc.)
