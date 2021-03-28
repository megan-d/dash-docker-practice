const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const Sprint = require('../models/Sprint');

//*****SPRINT ROUTES */

//ROUTE: GET api/projects/sprints/me
//DESCRIPTION: Get all sprints for current user (where you are one of the developers)
//ACCESS LEVEL: Private
router.get('/me', verify, async (req, res) => {
  try {
    //   Find the all sprints assigned to the user based on the id that comes in with the request's token.
    const assignedSprints = await Sprint.find({
      $or: [
        { developers: { _id: req.user.id } },
        { owner: { _id: req.user.id } },
      ],
    })
      .populate('project')
      .populate('developers');

    //If there are no sprints, return an error
    if (assignedSprints.length === 0) {
      return res.status(400).json({
        errors: [{ msg: 'There are no sprints assigned to this user.' }],
      });
    }
    res.json(assignedSprints);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/projects/sprints/:project_id
//DESCRIPTION: Get all sprints for a project
//ACCESS LEVEL: Private
router.get('/:project_id', verify, async (req, res) => {
  try {
    //   Find the all sprints associated with a project. Populate project details so have that as well (e.g., so can filter projects by manager and get all sprints for projects where you're the manager)
    let project = await Project.findOne({
      _id: req.params.project_id,
    }).populate('sprints');
    let sprints = project.sprints;

    //If there are no sprints, return an error
    if (sprints.length === 0) {
      return res.status(400).json({
        errors: [{ msg: 'There are no sprints available for this project.' }],
      });
    }
    res.json(sprints);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/projects/sprints/tickets/:sprint_id
//DESCRIPTION: Get all tickets for a sprint
//ACCESS LEVEL: Private
router.get('/tickets/:sprint_id', verify, async (req, res) => {
  try {
    //   Find the sprint. Populate ticket information.
    let sprint = await Sprint.findOne({
      _id: req.params.sprint_id,
    }).populate('tickets');

    //If there is no sprint, return an error
    if (!sprint) {
      return res.status(400).json({
        errors: [{ msg: 'This sprint could not be found.' }],
      });
    }
    res.json(sprint.tickets);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/projects/sprints/sprint/:sprint_id
//DESCRIPTION: Get sprint by id
//ACCESS LEVEL: Private
router.get('/sprint/:sprint_id', verify, async (req, res) => {
  try {
    let sprint = await Sprint.findOne({ _id: req.params.sprint_id })
      .populate('project tickets')
      .populate('developers', 'username firstName lastName')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    //If there are no sprints, return an error
    if (!sprint) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'This sprint could not be found.' }] });
    }
    res.json(sprint);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/projects/sprints/:project_id
//DESCRIPTION: Create a new sprint
//ACCESS LEVEL: Private
router.post(
  '/:project_id',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('title', 'Please provide a sprint title.')
        .not()
        .isEmpty()
        .trim(),
      check('description', 'Please provide a sprint description.')
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
    const { title, description } = req.body;

    //Build the sprintItems object. If the value is there, add it to the sprintItems object.
    const sprintItems = {};

    sprintItems.submitter = req.user.id;
    sprintItems.owner = req.user.id;
    sprintItems.project = req.params.project_id;
    sprintItems.title = title;
    sprintItems.description = description;
    sprintItems.status = 'Sprint Created';
    sprintItems.statusLog = {
      status: 'Sprint Created',
    };

    //Once all fields are prepared, update and populate the data
    try {
      //Populate sprint titles. Check if a sprint with that title already exists for the project. If so, give error. If not, create new sprint.
      let project = await Project.findOne({
        _id: req.params.project_id,
      }).populate('sprints', 'title');

      if (!project) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'This project could not be found.' }] });
      }
      //Only allow project to be updated if admin user or manager on project
      if (
        req.user.role === 'admin' ||
        project.manager.toString() === req.user.id ||
        project.owner.toString() === req.user.id
      ) {
        let isExistingSprintTitle = project.sprints.filter(
          (sprint) => sprint.title === title,
        );
        if (isExistingSprintTitle.length > 0) {
          return res.status(400).json({
            errors: [
              {
                msg:
                  'A sprint with that title already exists for this project. Please select another title for the sprint.',
              },
            ],
          });
        }
        //Create new sprint instance and save to database
        let sprint = await new Sprint(sprintItems);
        await sprint.save();
        //Add sprint to project
        await Project.updateOne(
          { _id: req.params.project_id },
          { $push: { sprints: sprint } },
        );

        return res.json(sprint);
      } else {
        return res.status(401).json({
          errors: [{ msg: 'You are not permitted to perform this action.' }],
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: PUT api/projects/sprints/:project_id/:sprint_id
//DESCRIPTION: Update an existing sprint
//ACCESS LEVEL: Private

router.put(
  '/:project_id/:sprint_id',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('title', 'Please provide a sprint title.')
        .optional({ checkFalsy: true })
        .trim(),
      check('description', 'Please provide a sprint description.')
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
      title,
      description,
      startDate,
      plannedEndDate,
      dateCompleted,
      resolutionSummary,
      status,
      developer,
    } = req.body;

    //Build the updatedSprintItems object. If the value is there, add it to the updatedSprintItems object.
    const updatedSprintItems = {};

    updatedSprintItems.submitter = req.user.id;
    if (title) updatedSprintItems.title = title;
    if (description) updatedSprintItems.description = description;

    if (startDate) {
      const start = new Date(startDate);
      updatedSprintItems.startDate = start;
    }
    if (dateCompleted) {
      const completionDate = new Date(dateCompleted);
      updatedSprintItems.dateCompleted = completionDate;
    }
    if (plannedEndDate) {
      const date = new Date(plannedEndDate);
      updatedSprintItems.plannedEndDate = date;
    }
    if (resolutionSummary)
      updatedSprintItems.resolutionSummary = resolutionSummary;

    //Once all fields are prepared, update and populate the data
    try {
      let project = await Project.findOne({
        _id: req.params.project_id,
      }).populate(['sprints', 'tickets']);
      if (!project) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'This project could not be found. A sprint must be associated with an existing project. Please create a new project to add a sprint.',
            },
          ],
        });
      }

      let sprint = await Sprint.findOne({ _id: req.params.sprint_id });
      //Make so you can only update sprint if you are an admin user or the project manager or sprint owner
      if (
        req.user.role === 'admin' ||
        project.manager.toString() === req.user.id ||
        project.owner.toString() === req.user.id ||
        sprint.owner.toString() === req.user.id
      ) {
        if (title) {
          let isExistingSprintTitle = project.sprints.filter(
            (sprint) => sprint.title === title,
          );
          if (isExistingSprintTitle.length > 0) {
            return res.status(400).json({
              errors: [
                {
                  msg:
                    'A sprint with that title already exists for this project. Please select another title for the sprint.',
                },
              ],
            });
          }
        }
        if (status) {
          updatedSprintItems.status = status;
          await Sprint.updateOne(
            { _id: req.params.sprint_id },
            { $push: { statusLog: { status: status } } },
          );
          // sprint.statusLog.push({ status: status });
        }
        if (developer) {
          let user = await User.findOne({ username: developer });
          if (!user) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'This user could not be found.' }] });
          }
          let developerId = { _id: user._id };
          let isExistingSprintDeveloper = sprint.developers.filter(
            (dev) => dev._id.toString() === developerId._id.toString(),
          );
          if (isExistingSprintDeveloper.length === 0) {
            await Sprint.updateOne(
              { _id: req.params.sprint_id },
              { $push: { developers: developerId } },
            );
            await sprint.save();
          } else {
            return res.status(400).json({
              errors: [
                {
                  msg:
                    'That user is already on the sprint. Please select another user to add to the sprint.',
                },
              ],
            });
          }
          //Check to see if this developer is a developer on the project yet. If not, add them with request.
          let isExistingProjectDeveloper = project.developers.filter(
            (dev) => dev._id.toString() === developerId.toString(),
          );

          if (isExistingProjectDeveloper.length === 0) {
            //Add to developers array for project
            await Project.updateOne(
              { _id: req.params.project_id },
              { $push: { developers: developerId } },
            );
            // await project.developers.push(developerId);
          }
        }

        await sprint.save();
        await project.save();

        let updatedSprint = await Sprint.findOneAndUpdate(
          { _id: req.params.sprint_id },
          { $set: updatedSprintItems },
          { new: true },
        );

        //Send back the updated sprint
        return res.json(updatedSprint);
      } else {
        return res.status(401).json({
          errors: [{ msg: 'You are not permitted to perform this action.' }],
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: POST api/projects/sprints/:sprint_id/:ticket_id
//DESCRIPTION: Add a ticket to existing sprint
//ACCESS LEVEL: Private
router.get('/:sprint_id/:ticket_id', verify, async (req, res) => {
  try {
    //Get the sprint
    let sprint = await Sprint.findById(req.params.sprint_id).populate(
      'tickets',
    );
    let tickets = sprint.tickets;
    let isExistingTicket = tickets.filter(
      (ticket) => ticket._id.toString() === req.params.ticket_id,
    );
    //Check if ticket already exists for sprint
    if (isExistingTicket.length > 0) {
      return res.status(400).json({
        errors: [{ msg: 'This ticket has already been added to the sprint.' }],
      });
    }
    // if (
    //   req.user.role === 'admin' ||
    //   project.manager.toString() === req.user.id ||
    //   project.owner.toString() === req.user.id
    //   || sprint.owner.toString() === req.user.id
    // ) {
    //Get assigned developer from ticket and see if they are currently a developer on the sprint. If not, add them.
    const ticket = await Ticket.findById(req.params.ticket_id);
    const assignedDev = ticket.assignedDeveloper;

    let isExistingSprintDeveloper = sprint.developers.filter(
      (el) => el.toString() === assignedDev.toString(),
    );

    if (isExistingSprintDeveloper.length === 0) {
      //Add to developers array for sprint

      await Sprint.updateOne(
        { _id: req.params.sprint_id },
        { $push: { developers: assignedDev } },
      );
      // await sprint.developers.push(assignedDev);
    }

    //Add ticket ID onto sprint at the end of array (want chronological order in this case)
    await Sprint.updateOne(
      { _id: req.params.sprint_id },
      { $push: { tickets: req.params.ticket_id } },
    );
    // await sprint.tickets.push(req.params.ticket_id);

    //Save to database
    await sprint.save();

    //Send back all tickets
    res.json(sprint);
    // } else

    // return res.status(401).json({
    //   errors: [{ msg: 'You are not permitted to perform this action.' }],
    // });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: DELETE api/projects/sprints/ticket/:sprint_id/:ticket_id
//DESCRIPTION: Remove a ticket from an existing sprint
//ACCESS LEVEL: Private
router.delete('/ticket/:sprint_id/:ticket_id', verify, async (req, res) => {
  try {
    //Get the sprint
    let sprint = await Sprint.findById(req.params.sprint_id).populate(
      'tickets',
    );

    //Find index of ticket. Remove that element from array.
    let tickets = sprint.tickets;
    let index = tickets.map((el) => el._id).indexOf(req.params.ticket_id);
    if (index === -1) {
      return res.status(400).json({
        errors: [{ msg: 'This ticket could not be found.' }],
      });
    }

    // await Sprint.findByIdAndUpdate(req.params.sprint_id, {
    //   $pull: { "tickets": { _id: req.params.ticket_id } },
    // });
    // let deletedTicket = sprint.tickets.splice(index, 1);
    await sprint.tickets.pull({ _id: req.params.ticket_id });
    await sprint.save();
    res.json(sprint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/projects/sprints/comments/comment/:sprint_id
//DESCRIPTION: Comment on an existing sprint
//ACCESS LEVEL: Private
router.post(
  '/comment/:sprint_id',
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
      let user = await User.findById(req.user.id).select('-password');
      //Get the sprint
      let sprint = await Sprint.findById(req.params.sprint_id);
      //Create object for new comment. It's not a collection in database so just an object.
      const newComment = {
        title: req.body.title,
        comment: req.body.comment,
        user: req.user.id,
      };

      //Add newComment onto sprint comments at the end of array (want chronological order in this case)
      await Sprint.updateOne(
        { _id: req.params.sprint_id },
        { $push: { comments: newComment } },
      );
      // sprint.comments.push(newComment);

      //Save to database
      await sprint.save();

      //Send back all comments
      res.json(sprint.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: DELETE api/projects/sprints/:project_id/:sprint_id
//DESCRIPTION: Delete a sprint by sprint id
//ACCESS LEVEL: Private
//Must be Manager on the project or admin to delete it
router.delete('/:project_id/:sprint_id', verify, async (req, res) => {
  try {
    //Find project based on the project id from request parameters
    let project = await Project.findById(req.params.project_id).populate(
      'sprints',
      '_id',
    );

    //If the user is not an admin or the manager for the project, deny access.
    if (
      req.user.role === 'admin' ||
      project.manager.toString() === req.user.id ||
      project.owner.toString() === req.user.id
    ) {
      await Sprint.findOneAndRemove({ _id: req.params.sprint_id });

      //When sprint is deleted, also need to delete it from project (remove from array)
      let sprints = project.sprints;
      let index = sprints.map((el) => el._id).indexOf(req.params.sprint_id);
      if (index === -1) {
        return res.status(400).json({
          errors: [{ msg: 'This sprint could not be found.' }],
        });
      }

      await project.sprints.pull(req.params.sprint_id);
      // await Project.findByIdAndUpdate({ _id: req.params.project_id}, { $pull: { sprints: req.params.sprint_id } })
      // let deletedSprint = project.sprints.splice(index, 1);
      await project.save();
      res.json({ msg: 'This sprint has been deleted.' });
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
