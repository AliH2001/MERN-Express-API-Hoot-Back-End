// controllers/hoots.js

const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hoot = require('../models/hoot.js');

const router = express.Router();

// ========== Public Routes ===========

router.get('/', async (req, res) => {
  try {
    const hoots = await Hoot.find({}).populate('author').sort({ createdAt: 'desc' });
    res.status(200).json(hoots);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========= Protected Routes =========
router.use(verifyToken);

router.post('/', async (req, res) => {
  try {
    // Get the data from the form submitted,
    // but add the user as the author, since that is not an option on the form
    req.body.author = req.user._id;

    // Create the new hoot in the database
    const hoot = await Hoot.create(req.body);

    // instead of using populate to call the databse, just attach
    // the user object from the parsed token
    hoot._doc.author = req.user;

    res.status(201).json(hoot);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;