// meeting-place-api/models/Place.js
const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'bar', 'café', 'parc', 'autre']
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Créer un index géospatial pour les recherches de proximité
PlaceSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model('Place', PlaceSchema);