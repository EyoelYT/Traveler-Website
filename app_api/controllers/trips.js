const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const jwt = require('jsonwebtoken');
const User = mongoose.model('users');

const getUser = async (req, res, callback) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // callback(req, res, user.name);
      return user;
    } catch (err) {
      console.error("JWT Error:", err.message);
      res.status(401).json({ message: "Invalid token" });
      return null;
    }
  } else {
    console.log("No token provided");
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return null;
  }
};

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
  const q = await Model
    .find({}) // No filter, return single record
    .exec();

  // Uncomment the line to show the results of the query
  // console.log(q);

  if (!q) { // Database returned no data
    return res.status(404).json(err);
  } else { // Return resulting trip list
    return res.status(200).json(q);
  }

}

const tripsFindByCode = async (req, res) => {
  const q = await Model
    .find({ 'code': req.params.tripCode }) // No filter, return single record
    .exec();

  // Uncomment the line to show the results of the query
  // console.log(q);

  if (!q) {
    // Database returned no data
    return res.status(404).json(err);
  } else { // Return resulting trip list
    return res.status(200).json(q);
  }

}
const tripsAddTrip = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) {
      return;
    }

    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    });

    return res.status(201).json(trip);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Error creating trip" });
  }
};

const tripsUpdateTrip = async (req, res) => {
  try {
    const user = await getUser(req, res);
    if (!user) {
      // getUser will handle sending the response if there's no user
      return;
    }
    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
      },
      { new: true }
    ).exec(); // Use exec() to return a true Promise

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found with code " + req.params.tripCode,
      });
    }
    res.status(200).json(trip);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      res.status(404).json({
        message: "Trip not found with code " + req.params.tripCode,
      });
    } else {
      res.status(500).json(err);
    }
  }
};


module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
