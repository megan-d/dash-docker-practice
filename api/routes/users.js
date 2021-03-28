const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');

//ROUTE: GET api/users
//DESCRIPTION: Load logged in user
//ACCESS LEVEL: Private
router.get('/', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/users/:userid
//DESCRIPTION: Find user based on id
//ACCESS LEVEL: Private
router.get('/:userid', verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.userid).select('-password');
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/users
//DESCRIPTION: Register new user
//ACCESS LEVEL: Public (make request so can get access to private routes)
router.post(
  '/',
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

//ROUTE: PUT api/users
//DESCRIPTION: Update user information. Will need a different route to update password.
//ACCESS LEVEL: Private

router.put(
  '/',
  verify,
  [
    //Use express-validator to validate the inputs
    check('firstName', 'Please provide an updated first name')
      .optional({ checkFalsy: true })
      .trim(),
    check('lastName', 'Please provide an updated last name')
      .optional({ checkFalsy: true })
      .trim(),
    check('email', 'Please provide a valid email')
      .optional({ checkFalsy: true })
      .isEmail()
      .normalizeEmail(),
    check(
      'username',
      'Please provide a username that is at least 5 characters.',
    )
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 5 }),
  ],

  async (req, res) => {
    //pull all fields out of req.body using destructuring
    const {
      firstName,
      lastName,
      email,
      role,
      username,
      team,
      organization,
    } = req.body;

    //Build user object
    const updatedUserFields = {};
    //if the field is provided, add to profileFields object
    if (firstName) updatedUserFields.firstName = firstName;
    if (lastName) updatedUserFields.lastName = lastName;
    if (email) updatedUserFields.email = email;
    if (username) updatedUserFields.username = username;
    if (role) {
      if (req.user.role === 'admin') {
        updatedUserFields.role = role;
      } else {
        return res
          .status(401)
          .json({
            errors: [{ msg: 'You are not permitted to perform this action.' }],
          });
      }
    }

    //Add in logic for express validator error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Now that all fields are prepared, ready to update and insert the data. But first need to make sure email and/or username aren't already in use.
    try {
      //If user already exists in database other than what is there for current user, give error
      let emailInputUser = await User.findOne({ email });
      if (emailInputUser && emailInputUser.id !== req.userid) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'This email already exists' }] });
      }
      let usernameInputUser = await User.findOne({ username });
      if (usernameInputUser && usernameInputUser.id !== req.user.id) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'This username already exists' }] });
      }

      let user = await User.findOne({ _id: req.user.id }).select('-password');
      //If user isn't found throw error
      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{ msg: 'The profile for this user could not be found.' }],
          });
      } else {
        //if user is found, update it
        user = await User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: updatedUserFields },
          { new: true },
        );
        //Send back the entire profile
        return res.json(user);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: DELETE api/users
//DESCRIPTION: Delete user
//ACCESS LEVEL: Private

router.delete('/', verify, async (req, res) => {
  try {
    //First delete profile for user
    await Profile.findOneAndRemove({ user: req.user.id });

    //Find user that corresponds to user id found in token and delete
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'This user and associated profile have been deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
