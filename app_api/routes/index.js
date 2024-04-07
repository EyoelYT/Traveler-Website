const express = require('express');
const router = express.Router();

// Here, import the controllers we will route
const tripsController = require('../controllers/trips');

// Define route for our trips endpoint
router
  .route('/trips')
  .get(tripsController.tripsList); // Get Methods route tripList

// GET Method routes tripsFindByCode - requires parameter
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode); // Get Methods route tripList

module.exports = router;
