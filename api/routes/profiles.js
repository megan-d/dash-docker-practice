const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const Profile = require('../models/Profile');

//*****PROFILE ROUTES */

//ROUTE: GET api/profiles
//DESCRIPTION: Get all developer profiles
//ACCESS LEVEL: Private
router.get('/', verify, async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', [
      'username',
      'firstName',
      'lastName',
    ]);
    res.json(profiles);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/profiles/me
//DESCRIPTION: Get current user's profile
//ACCESS LEVEL: Private
router.get('/me', verify, async (req, res) => {
  try {
    //Find the profile
    let profile = await Profile.findOne({ user: req.user.id }).populate('user');
    if (!profile) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'An existing profile could not be found. Please create a profile.',
          },
        ],
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/profiles/user/:user_id
//DESCRIPTION: Get profile by User ID
//ACCESS LEVEL: Private
router.get('/user/:user_id', verify, async (req, res) => {
  try {
    //Find the profile
    let profile = await Profile.findOne({
      user: req.params.user_id,
    })
      .populate('user', ['username', 'firstName', 'lastName'])
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    if (!profile) {
      return res.status(400).json({
        errors: [
          {
            msg:
              'An existing profile could not be found. Please create a profile.',
          },
        ],
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/profiles
//DESCRIPTION: Create user profile
//ACCESS LEVEL: Private
router.post(
  '/',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('bio', 'Please provide a brief bio for your profile.')
        .not()
        .isEmpty()
        .trim(),
      check('skills', 'Please list your technical skills.')
        .not()
        .isEmpty()
        .trim(),
    ],
  ],
  async (req, res) => {
    //Add in logic for express validator error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //Pull all of the fields out into variables from req.body.
    const { bio, skills } = req.body;

    //Build the profileItems object. If the value is there, add it to the profileItems object.
    const profileItems = {};

    profileItems.user = req.user.id;
    profileItems.bio = bio;

    if (skills) {
      profileItems.skills = skills.split(',').map((tech) => tech.trim());
    } else {
      profileItems.skills = [];
    }

    //Once all fields are prepared, populate the data
    //Need to find the projects for the user to populate them
    try {
      //if profile already exists for this user, throw error and say go to update profile
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'You already created a profile. Please go to your profile page to edit your existing profile.',
            },
          ],
        });
      } else {
        let projects = await Project.find({
          owner: req.user.id,
        });
        if (projects.length > 0) {
          profileItems.myProjects = projects;
        } else {
          profileItems.myProjects = [];
        }

        let profile = await new Profile(profileItems);
        await profile.save();
        res.json(profile);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: PUT api/profiles/:user_id
//DESCRIPTION: Edit user profile
//ACCESS LEVEL: Private
router.put(
  '/:user_id',
  verify,
  [
    //Use express-validator to validate the inputs
    check('bio', 'Please provide a brief bio')
      .optional({ checkFalsy: true })
      .trim(),
    check('skills', 'Please provide your skills')
      .optional({ checkFalsy: true })
      .trim(),
  ],

  async (req, res) => {
    //Add in logic for express validator error check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //pull all fields out of req.body using destructuring. Note on front end that inputs are case sensitive.
    const { bio, skills } = req.body;

    //Build updatedProjectFields object. If the field is provided, add to profileFields object
    const updatedProfileFields = {};
    let updatedSkills;
    if (bio) updatedProfileFields.bio = bio;

    try {
      let profile = await Profile.findOne({ user: req.params.user_id });
      let currentUser = await User.findOne({ _id: req.user.id }).select(
        '-password',
      );
      if (!profile) {
        return res.status(400).json({
          errors: [{ msg: 'The profile for this user could not be found.' }],
        });
      }
      //Only allow profile to be updated if admin user or owner of profile
      if (
        currentUser.role === 'admin' ||
        req.params.user_id.toString() === req.user.id
      ) {
        if (skills) {
          updatedSkills = skills.split(',').map((tech) => tech.trim());
          await Profile.findOneAndUpdate(
            { user: { _id: req.params.user_id } },
            { $push: { skills: { $each: updatedSkills } } },
            { upsert: true, new: true },
          );
        }

        //Then, update profile with provided updates from updatedProfileFields
        let updatedProfile = await Profile.findOneAndUpdate(
          { user: { _id: req.params.user_id } },
          { $set: updatedProfileFields },
        );

        //Send back the entire profile
        return res.json(updatedProfile);
      } else {
        return res.status(401).json({
          errors: [{ msg: 'You are not permitted to perform this action.' }],
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: POST api/profiles/comment/:profile_id
//DESCRIPTION: Comment on an existing profile
//ACCESS LEVEL: Private
router.post(
  '/comment/:profile_id',
  [
    verify,
    [
      check('comment', 'Please provide text in the comment field.')
        .not()
        .isEmpty()
        .trim(),
      check('title', 'Please provide text in the title field.')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    //Do error checking
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Create variable called user to get user. Since we are logged in, we have the id from the token.
      const user = await User.findById(req.user.id).select('-password');
      //Get the project
      const profile = await Profile.findById(req.params.profile_id);
      //Create object for new comment. It's not a collection in database so just an object.
      const newComment = {
        comment: req.body.comment,
        title: req.body.title,
        user: req.user.id,
      };

      //Add newComment onto profile comments at the end of array (want chronological order in this case)
      await Profile.updateOne(
        { _id: req.params.profile_id },
        { $push: { comments: newComment } },
        { new: true },
      );

      //Save to database
      await profile.save();

      //Send back updated profile
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: DELETE api/profiles/user/:user_id
//DESCRIPTION: Delete user profile by userId
//ACCESS LEVEL: Private
router.delete('/user/:user_id', verify, async (req, res) => {
  try {
    //Find profile based on the user id from request parameters
    const profile = await Profile.findOne({
      user: req.params.user_id.toString(),
    });

    if (!profile) {
      return res.status(400).json({
        errors: [{ msg: 'A profile could not be found for this user.' }],
      });
    }

    //If the user is not the one who owns the profile or is not an admin, deny access.
    if (
      req.user.role === 'admin' ||
      req.params.user_id.toString() === req.user.id
    ) {
      await Profile.findOneAndRemove({ user: req.params.user_id });

      res.json({
        msg: 'This profile has been deleted.',
      });
    } else {
      return res.status(401).json({
        errors: [{ msg: 'You are not permitted to perform this action.' }],
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
