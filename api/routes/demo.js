const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Ticket = require('../models/Ticket');
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');

//ROUTE: POST api/demo/users
//DESCRIPTION: Register new demo user
//ACCESS LEVEL: Public (make request so can get access to private routes)
router.post(
    '/users',
    [
      //Use express-validator to validate the inputs
      check('firstName', 'Please provide a first name')
        .not()
        .isEmpty()
        .trim(),
      check('lastName', 'Please provide a last name')
        .not()
        .isEmpty()
        .trim(),
      check(
        'username',
        'Please provide a username that is at least 5 characters.',
      )
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 5 }),
      check('email', 'Please provide a valid email')
        .isEmail()
        .normalizeEmail(),
      check(
        'password',
        'Please provide a password with 8 or more characters',
      ).isLength({ min: 8 }),
      check('password', 'Passwords do not match').custom(
        (value, { req }) => value === req.body.confirmPassword,
      ),
    ],
    async (req, res) => {
      //Show error if validation fails
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // req.flash('error', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { firstName, lastName, username, email, password } = req.body;
  
      try {
        //If user already exists in database, give error
        let emailInput = await User.findOne({ email });
        if (emailInput) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'This email already exists' }] });
        }
        let usernameInput = await User.findOne({ username });
        if (usernameInput) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'This username already exists' }] });
        }
  
        //If user doesn't already exist, encrypt password with bcrypt and create new user. Hash password.
        user = new User({
          firstName,
          lastName,
          username,
          email,
          password,
        });
  
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
  
        await user.save();
  
        //Add user ID to payload so it comes in with token
        const payload = {
          user: {
            id: user.id,
          },
        };
  
        //Return Jsonwebtoken so have access upon registration
        jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { expiresIn: 3600 },
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

