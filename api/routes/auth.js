const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/User');

//ROUTE: POST api/auth
//DESCRIPTION: Authenticate user (login existing user)
//ACCESS LEVEL: Public (make request so can get access to private routes)
router.post(
  '/',
  [
    //Use express-validator to validate the inputs
    check('email', 'Please provide a valid email')
      .isEmail()
      .normalizeEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    //Add validation. If doesn't pass the above validation, respond witih error. Need to adjust how handling flash errors (won't work like this)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //If passes validation, check for user in database. If user, authenticate user and issue jwt. Otherwise, throw error.
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //If user exists in db but email and password don't match, return error
      const matches = await bcrypt.compare(req.body.password, user.password);
      if (!matches) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      //If user exists in database and password matches email, create and assign a jsonwebtoken
      //Add user ID to payload so it comes in with token
      const payload = {
        user: {
          id: user.id,
        },
      };
      
      jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { expiresIn: 1800 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );
    } catch (error) {
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
