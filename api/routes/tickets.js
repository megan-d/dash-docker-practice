const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const verify = require('../middleware/verifyToken');

const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

//*****TICKET ROUTES */

//ROUTE: GET api/projects/tickets/me
//DESCRIPTION: Get all tickets assigned to user (where you are the assignedDeveloper on the ticket)
//ACCESS LEVEL: Private
router.get('/me', verify, async (req, res) => {
  try {
    //   Find the all tickets assigned to the user based on the id that comes in with the request's token. Populate project details so have that as well (so can filter by project too);
    const assignedTickets = await Ticket.find({
      assignedDeveloper: req.user.id,
    }).populate('project');

    //If there are no tickets, return an error
    if (assignedTickets.length === 0) {
      return res.status(400).json({
        errors: [{ msg: 'There are no tickets available for this user.' }],
      });
    }
    res.json(assignedTickets);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/projects/tickets/:project_id
//DESCRIPTION: Get all tickets for a project
//ACCESS LEVEL: Private
router.get('/:project_id', verify, async (req, res) => {
  try {
    //   Find the all tickets associated with a project. Populate project details so have that as well (e.g., so can filter projects by manager and get all tickets for projects where you're the manager)
    let project = await Project.findOne({
      _id: req.params.project_id,
    }).populate('tickets');
    let tickets = project.tickets;

    //If there are no tickets, return an error
    if (tickets.length === 0) {
      return res.status(400).json({
        errors: [{ msg: 'There are no tickets available for this project.' }],
      });
    }
    res.json(tickets);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: GET api/projects/tickets/ticket/:ticket_id
//DESCRIPTION: Get ticket by ID
//ACCESS LEVEL: Private
router.get('/ticket/:ticket_id', verify, async (req, res) => {
  try {
    let ticket = await Ticket.findOne({ _id: req.params.ticket_id })
      .populate('project')
      .populate({
        path: 'project',
        populate: {
          path: 'sprints',
        },
      })
      .populate('assignedDeveloper', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      });

    //If there are no tickets, return an error
    if (!ticket) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'This ticket could not be found.' }] });
    }
    res.json(ticket);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE: POST api/projects/tickets/:project_id
//DESCRIPTION: Create a new ticket for project
//ACCESS LEVEL: Private
router.post(
  '/:project_id',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('title', 'Please provide a ticket title.')
        .not()
        .isEmpty()
        .trim(),
      check('type', 'Please provide a ticket type.')
        .not()
        .isEmpty()
        .trim(),
      check('description', 'Please provide a ticket description.')
        .not()
        .isEmpty()
        .trim(),
      check('priority', 'Please provide a priority for the ticket.')
        .not()
        .isEmpty()
        .trim(),
      check('dateDue', 'Please provide a due date in the future.')
        .not()
        .isEmpty(),
      check(
        'assignedDeveloper',
        'A developer is required for the project. Search for developers by username and assign one to the ticket.',
      )
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
    const {
      title,
      type,
      description,
      priority,
      dateDue,
      assignedDeveloper,
      dateCompleted,
      resolutionSummary,
    } = req.body;

    //Build the ticketItems object. If the value is there, add it to the ticketItems object.
    const ticketItems = {};

    ticketItems.submitter = req.user.id;
    ticketItems.project = req.params.project_id;
    ticketItems.title = title;
    ticketItems.type = type;
    ticketItems.description = description;
    ticketItems.priority = priority;
    const date = new Date(dateDue);
    ticketItems.dateDue = date;
    ticketItems.status = 'Assigned';

    ticketItems.history = {
      typeOfChange: 'Ticket Created',
    };

    //Once all fields are prepared, update and populate the data
    try {
      //Populate ticket titles. Check if a ticket with that title already exists for the project. If so, give error. If not, create new ticket.
      const project = await Project.findOne({
        _id: req.params.project_id,
      }).populate('tickets');

      let isExistingTicketTitle = project.tickets.filter(
        (ticket) => ticket.title === title,
      );
      if (isExistingTicketTitle.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'A ticket with that title already exists. Please select another title for the ticket.',
            },
          ],
        });
      }

      let user = await User.findOne({ username: assignedDeveloper });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'The assigned developer could not be found.' }],
        });
      }
      let developerId = user._id;
      ticketItems.assignedDeveloper = developerId;

      let ticket = await new Ticket(ticketItems);
      await ticket.save();
      // await Ticket.updateOne(
      //   { _id: ticket._id },
      //   { $push: { history: historyItem } },
      // );

      // // await ticket.history.push(historyItem);
      // await ticket.save();

      //Check to see if assigned developer is a developer on the project yet. If not, add them with request.
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
      await Project.updateOne(
        { _id: req.params.project_id },
        { $push: { tickets: ticket } },
      );
      // await project.tickets.push(ticket);
      await project.save();
      return res.json(ticket);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: POST api/projects/tickets/comment/:ticket_id
//DESCRIPTION: Comment on an existing ticket
//ACCESS LEVEL: Private
router.post(
  '/comment/:ticket_id',
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
      //Get the ticket
      let ticket = await Ticket.findById(req.params.ticket_id);
      //Create object for new comment. It's not a collection in database so just an object.
      const newComment = {
        title: req.body.title,
        comment: req.body.comment,
        user: req.user.id,
      };

      //Add newComment onto ticket comments at the end of array (want chronological order in this case)
      await Ticket.updateOne(
        { _id: req.params.ticket_id },
        { $push: { comments: newComment } },
      );
      // ticket.comments.push(newComment);

      //Save to database
      await ticket.save();

      //Send back all comments
      res.json(ticket.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

//ROUTE: PUT api/projects/tickets/:project_id/:ticket_id
//DESCRIPTION: Update an existing ticket
//ACCESS LEVEL: Private
router.put(
  '/:project_id/:ticket_id',
  [
    verify,
    [
      //User express validator to validate required inputs
      check('title', 'Please provide a ticket title.')
        .optional({ checkFalsy: true })
        .trim(),
      check('type', 'Please provide a ticket type.')
        .optional({ checkFalsy: true })
        .trim(),
      check('description', 'Please provide a ticket description.')
        .optional({ checkFalsy: true })
        .trim(),
      check('history', 'Please provide a type of change for ticket history.')
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
    const {
      title,
      type,
      description,
      priority,
      dateDue,
      assignedDeveloper,
      history,
      status,
      dateCompleted,
      resolutionSummary,
    } = req.body;

    //Build the updatedTicketItems object. If the value is there, add it to the updatedTicketItems object.
    const updatedTicketItems = {};

    updatedTicketItems.submitter = req.user.id;
    if (title) updatedTicketItems.title = title;
    if (type) updatedTicketItems.type = type;
    if (description) updatedTicketItems.description = description;
    if (priority) updatedTicketItems.priority = priority;
    if (dateDue) {
      const date = new Date(dateDue);
      updatedTicketItems.dateDue = date;
    }
    if (status) updatedTicketItems.status = status;
    if (dateCompleted) {
      const completionDate = new Date(dateCompleted);
      updatedTicketItems.dateCompleted = completionDate;
    }
    if (resolutionSummary)
      updatedTicketItems.resolutionSummary = resolutionSummary;

    let historyItem = {
      typeOfChange: history,
    };

    //Once all fields are prepared, update and populate the data
    try {
      let project = await Project.findOne({
        _id: req.params.project_id,
      }).populate('tickets');
      if (!project) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'This project could not be found.' }] });
      }

      //Go through array of assigned developers and filter by current user to see if they are one
      let isProjectDeveloper = project.developers.filter(
        (dev) => dev._id.toString() === req.user.id.toString(),
      );
      //Make so you can only update ticket if you are an admin user, the project manager, the assigned developer, or a developer on the project
      let ticket = await Ticket.findOne({ _id: req.params.ticket_id });
      if (
        req.user.role === 'admin' ||
        project.manager.toString() === req.user.id ||
        project.owner.toString() === req.user.id ||
        isProjectDeveloper.length > 0 ||
        ticket.assignedDeveloper.toString() === req.user.id.toString()
      ) {
        //Need to decide if only want project manager or admin user to update tickets, or if anybody can update tickets
        if (title) {
          if (ticket.title === title) {
            return res.status(400).json({
              errors: [
                {
                  msg:
                    'A ticket with that title already exists. Please select another title for the ticket.',
                },
              ],
            });
          }
        }

        if (assignedDeveloper) {
          let user = await User.findOne({ username: assignedDeveloper });
          if (!user) {
            return res.status(400).json({
              errors: [{ msg: 'The assigned developer could not be found.' }],
            });
          }
          let developerId = user._id;
          updatedTicketItems.assignedDeveloper = developerId;

          //Check to see if assigned developer is a developer on the project yet. If not, add them with request.
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

        //When update ticket, push type of change to history array so have a log of ticket history.
        await Ticket.updateOne(
          { _id: ticket._id },
          { $push: { history: historyItem } },
        );
        // await ticket.history.push(historyItem);
        await ticket.save();
        await project.save();

        let updatedTicket = await Ticket.findOneAndUpdate(
          { _id: req.params.ticket_id },
          { $set: updatedTicketItems },
          { new: true },
        );

        //Send back the updated ticket
        return res.json(updatedTicket);
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

//ROUTE: DELETE api/projects/tickets/:project_id/:ticket_id
//DESCRIPTION: Delete a ticket on given project by ticket id
//ACCESS LEVEL: Private
//Must be Manager on the project, owner of project, or admin to delete it
router.delete('/:project_id/:ticket_id', verify, async (req, res) => {
  try {
    //Find project based on the project id from request parameters
    let project = await Project.findById(req.params.project_id).populate(
      'tickets',
      '_id',
    );
    //If the user is not an admin or the manager for the project, deny access.
    if (
      req.user.role === 'admin' ||
      project.manager.toString() === req.user.id ||
      project.owner.toString() === req.user.id
    ) {
      await Ticket.findOneAndRemove({ _id: req.params.ticket_id });

      let tickets = project.tickets;
      let index = tickets.map((el) => el._id).indexOf(req.params.ticket_id);
      if (index === -1) {
        return res.status(400).json({
          errors: [{ msg: 'This ticket could not be found.' }],
        });
      }
      await project.tickets.pull(req.params.ticket_id);
      // let deletedTicket = project.tickets.splice(index, 1);
      await project.save();
      res.json({ msg: 'This ticket has been deleted.' });

      //When ticket is deleted, also need to delete it from project (remove from array)
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
