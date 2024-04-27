const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');

const auth = jwt.expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'payload'
});
console.log("auth (jwt): ", auth);

// Here, import the controllers we will route
const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router
  .route('/login')
  .post(authController.login);

router
  .route('/register')
  .post(authController.register);

// Define route trips endpoint
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(auth, tripsController.tripsAddTrip); // Get Methods route tripList

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // Get Methods route tripList
    .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;
