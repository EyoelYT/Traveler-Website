const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const jwt = require('jsonwebtoken');
const User = mongoose.model('users');

const getUser = (req, res, callback) => {
  console.log("Trying to fetch user");
  if (req.payload && req.payload.email) {
    User.findOne({ email: req.payload.email }).exec((err, user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else if (err) {
        console.log(err);
        return res.status(404).json(err);
      }
      callback(req, res, user.name);
    });
  } else {
    console.log("Couldn't find user since payload =", req.payload);
    return res.status(404).json({ message: "Undefined payload" });
  }
};

// const getUser = async (req, res, callback) => {
//   if (req.payload && req.payload.email) {
//     try {
//       const user = await User.findOne({ email: req.payload.email }).exec();
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       callback(req, res, user.name);
//     } catch (err) {
//       console.log(err);
//       return res.status(404).json(err);
//     }
//   } else {
//     return res.status(404).json({ message: "User not found" });
//   }
// };

// const getUser = async (req) => {
//   // console.log("payload". req.payload)
//   // console.log("payload email". req.payload.email)
//   if (req.payload && req.payload.email) {
//     const user = await User.findOne({ email: req.payload.email }).exec();
//     if (!user) {
//       throw Error('User not found');
//     }
//     return user;
//   } else {
//     throw Error('User not found bc JWT');
//   }
// };


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


// const tripsAddTrip = async (req, res) => {
//   // console.log(req.headers); // This will show you all headers, including the Authorization header.
//   // console.log(req.payload); // This will show you the decoded JWT payload if it's being set correctly.
//   try {
//     const user = await getUser(req);
//     const trip = await Trip.create({
//       // Add the user's name or ID to the trip document if necessary
//       // For example, as an owner or createdBy field:
//       // owner: user._id, or createdBy: user.name,
//       code: req.body.code,
//       name: req.body.name,
//       length: req.body.length,
//       start: req.body.start,
//       resort: req.body.resort,
//       perPerson: req.body.perPerson,
//       image: req.body.image,
//       description: req.body.description,
//     });
//     return res.status(201).json(trip);
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({ message: err.message });
//   }
// };


// const tripsAddTrip = async (req, res) => {
//   getUser(req, res, async (req, res, name) => {
//     try {
//       const trip = await Trip.create({
//         code: req.body.code,
//         name: req.body.name,
//         length: req.body.length,
//         start: req.body.start,
//         resort: req.body.resort,
//         perPerson: req.body.perPerson,
//         image: req.body.image,
//         description: req.body.description,
//       });
//       return res.status(201).json(trip);
//     } catch (err) {
//       return res.status(400).json(err);
//     }

function extractToken (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

const tripsAddTrip = async (req, res) => {
  // req.payload = extractToken(req.headers.authorization[1]);
  // req.payload.email = jwt.decode(req.payload);
  // console.log("request header req.header = ", req.headers);
  getUser(req, res, (req, res) => {
    Trip.create(
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
      (err, trip) => {
        if (err) {
          return res
            .status(400) // bad request
            .json(err);
        } else {
          return res
            .status(201) // created
            .json(trip);
        }
      }
    );
  });
}; 

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
  getUser(req, res, (req, res) => {
    Trip.findOneAndUpdate(
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
    )
      .then((trip) => {
        if (!trip) {
          return res.status(404).send({
            message: "Trip not found with code " + req.params.tripCode,
          });
        }
        res.send(trip);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Trip not found with code " + req.params.tripCode,
          });
        }
        return res
          .status(500) // server error
          .json(err);
      });
  });
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
