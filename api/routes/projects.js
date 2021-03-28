const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

//*****OVERALL PROJECT ROUTES */

//ROUTE: GET api/projects/me
//DESCRIPTION: Get all projects associated with current user (not where they are just the owner of)
//ACCESS LEVEL: Private
router.get('/me', verify, async (req, res) => {
  try {
    //   Find the relevant projects associated with user based on the id that comes in with the request's token. Could be manager role or developer role on project.
    let projects = await Project.find({
      $or: [
        { developers: { _id: req.user.id } },
        { manager: req.user.id },
        { owner: req.user.id },
      ],
    }).populate('tickets');

    //If there is no project, return an error
    if (projects.length === 0) {
      return res.status(400).json({
        errors: [{ msg: 'There are no projects available for this user.' }],
      });
    }
    //If there are projects, send those projects
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ROUTE:  GET api/projects/:project_id
// DESCRIPTION:    Get project by project id
// ACCESS LEVEL:  Private

router.get('/:project_id', verify, async (req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.project_id,
    })
      .populate('sprints tickets')
      .populate('developers', 'username firstName lastName')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      })

    if (!project)
      return res.status(400).json({ errors: [{ msg: 'Project not found' }] });

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/projects
//DESCRIPTION: Create a new project
//ACCESS LEVEL: Private
//Note: Developers won't be added until after the project is created (see PUT route)
router.post(
  '/',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('name', 'Please provide a project name.')
        .not()
        .isEmpty()
        .trim(),
      check('description', 'Please provide a project description.')
        .not()
        .isEmpty()
        .trim(),
      check(
        'targetCompletionDate',
        'Please provide a target date in the future.',
      )
        .not()
        .isEmpty(),
      check('manager', 'Please provide the username for a manager.')
        .optional({ checkFalsy: true })
        .trim(),
      check('repoLink', 'Please provide a link to the project repo.')
        .optional({ checkFalsy: true })
        .trim(),
      check('liveLink', 'Please provide a link to the live application.')
        .optional({ checkFalsy: true })
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
    const {
      name,
      description,
      targetCompletionDate,
      manager,
      repoLink,
      liveLink,
      techStack,
    } = req.body;

    //Build the projectItems object. If the value is there, add it to the profileItems object.
    const projectItems = {};

    projectItems.owner = req.user.id;
    projectItems.name = name;
    projectItems.description = description;
    projectItems.targetCompletionDate = targetCompletionDate;
    if (manager) {
      projectItems.manager = manager;
    } else {
      projectItems.manager = req.user.id;
    }

    projectItems.repoLink = repoLink;
    projectItems.liveLink = liveLink;
    if (techStack) {
      projectItems.techStack = techStack.split(',').map((tech) => tech.trim());
    } else {
      projectItems.techStack = [];
    }

    //Once all fields are prepared, update and populate the data
    try {
      //Check if a project with that name already exists for that user. If a project with that name exists where the owner is the user creating the project, say that project name has already been used.
      let projects = await Project.find({
        name: req.body.name,
        owner: req.user.id,
      });
      if (projects.length > 0) {
        return res.status(400).json({
          errors: [{ msg: 'You already own a project with that name.' }],
        });
      }
      //Match the username entered for manager to the user id in the database
      if (projectItems.manager !== req.user.id) {
        let user = await User.findOne({ username: projectItems.manager });
        if (!user) {
          return res.status(400).json({
            errors: [
              { msg: 'The user selected for manager could not be found.' },
            ],
          });
        } else {
          //convert username to id
          projectItems.manager = user._id;
        }
      }
      //If project name isn't found or doesn't already exist, create a new one
      if (projects.length === 0) {
        let project = await new Project(projectItems);
        await project.save();
        res.json(project);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: PUT api/projects/:project_id
//DESCRIPTION: Update an existing project's details
//ACCESS LEVEL: Private
//Must be Manager on the project or admin to update it
router.put(
  '/:project_id',
  verify,
  [
    //Use express-validator to validate the inputs
    check('name', 'Please provide an updated name')
      .optional({ checkFalsy: true })
      .trim(),
    check('description', 'Please provide a description')
      .optional({ checkFalsy: true })
      .trim(),
    check('developer', 'Please provide a developer')
      .optional({ checkFalsy: true })
      .trim(),
    check('manager', 'Please provide a manager')
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
    const {
      name,
      description,
      targetCompletionDate,
      manager,
      developer,
      completionDate,
      repoLink,
      liveLink,
      techStack,
    } = req.body;

    //Build updatedProjectFields object. If the field is provided, add to profileFields object
    const updatedProjectFields = {};
    let updatedTechStack = [];
    if (name) updatedProjectFields.name = name;
    if (description) updatedProjectFields.description = description;
    if (targetCompletionDate)
      updatedProjectFields.targetCompletionDate = targetCompletionDate;
    if (completionDate) updatedProjectFields.completionDate = completionDate;
    if (repoLink) updatedProjectFields.repoLink = repoLink;
    if (liveLink) updatedProjectFields.liveLink = liveLink;
    if (techStack) {
      updatedTechStack = techStack.split(',').map((tech) => tech.trim());
    }

    try {
      let project = await Project.findOne({ _id: req.params.project_id });
      let currentUser = await User.findById(req.user.id).select('-password');
      //Only allow project to be updated if admin user or manager on project
      if (!project) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'This project could not be found.' }] });
      }

      if (
        currentUser.role === 'admin' ||
        project.manager.toString() === req.user.id ||
        project.owner.toString() === req.user.id
      ) {
        if (name) {
          //If changing name, check if a project with that name already exists for that user. If a project with that name exists where the owner is the user creating the project, say that project name has already been used.
          let projects = await Project.find({
            name: req.body.name,
            owner: req.user.id,
          });
          if (projects.length > 0) {
            return res.status(400).json({
              errors: [{ msg: 'You already own a project with that name.' }],
            });
          }
        }

        //If adding developer or manager, check to make sure they are in the system. User can be submitted by username.
        //If adding a developer, first add that to project. Before adding, check to make sure developer doesn't already exist in developers array.
        if (developer) {
          let user = await User.findOne({ username: developer });
          if (!user) {
            return res.status(400).json({
              errors: [
                {
                  msg: 'The user selected for developer could not be found.',
                },
              ],
            });
          }
          let developerId = { _id: user._id };
          let isExistingDeveloper = project.developers.filter(
            (dev) => dev._id.toString() === developerId._id.toString(),
          );
          if (isExistingDeveloper.length === 0) {
            await Project.updateOne(
              { _id: req.params.project_id },
              { $push: { developers: developerId } },
            );
            await project.save();
          } else {
            return res.status(400).json({
              errors: [
                {
                  msg:
                    'That user is already on the project. Please select another user to add to the project.',
                },
              ],
            });
          }
        }
        if (techStack) {
          await Project.updateOne(
            { _id: req.params.project_id },
            { $push: { techStack: { $each: updatedTechStack } } },
            { upsert: true, new: true },
          );
          await project.save();
        }
        if (manager) {
          let user = await User.findOne({ username: manager });
          if (!user) {
            return res.status(400).json({
              errors: [
                { msg: 'The user selected for manager could not be found.' },
              ],
            });
          } else {
            updatedProjectFields.manager = user._id;
          }
        }

        //Then, update project with provided updates from updatedProjectFields
        let updatedProject = await Project.findOneAndUpdate(
          { _id: req.params.project_id },
          { $set: updatedProjectFields },
          { new: true },
        );

        //Send back the entire project
        return res.json(updatedProject);
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

//ROUTE: PUT api/projects/comment/:project_id
//DESCRIPTION: Comment on an existing project
//ACCESS LEVEL: Private
router.put(
  '/comment/:project_id',
  [
    verify,
    [
      check('comment', 'Please provide text in the comment field.')
        .not()
        .isEmpty()
        .trim(),
      check('title', 'Please provide text in the title field.')
        .not()
        .isEmpty()
        .trim(),
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
      const project = await Project.findById(req.params.project_id);
      //Create object for new comment. It's not a collection in database so just an object.
      const newComment = {
        comment: req.body.comment,
        title: req.body.title,
        user: req.user.id,
      };

      //Add newComment onto project comments at the end of array (want chronological order in this case)
      await Project.updateOne(
        { _id: req.params.project_id },
        { $push: { comments: newComment } },
      );
      // project.comments.push(newComment);

      //Save to database
      await project.save();

      //Send back project
      res.json(project);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: DELETE api/projects/:project_id
//DESCRIPTION: Delete a project by project's id
//ACCESS LEVEL: Private
//Must be Manager on the project or admin to delete it
router.delete('/:project_id', verify, async (req, res) => {
  try {
    //Find project based on the project id from request parameters
    const project = await Project.findById(req.params.project_id);

    //If the user is not an admin or the owner for the project, deny access.
    if (req.user.role === 'admin' || project.owner.toString() === req.user.id) {
      await Project.findOneAndRemove({ _id: req.params.project_id });
      //Also delete tickets and sprints associated with the project
      await Ticket.deleteMany({
        project: {
          _id: req.params.project_id,
        },
      });
      await Sprint.deleteMany({
        project: {
          _id: req.params.project_id,
        },
      });
      res.json({
        msg:
          'This project and its associated tickets and sprints have been deleted.',
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
