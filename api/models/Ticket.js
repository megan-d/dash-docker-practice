const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  submitter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateDue: {
    type: Date,
    required: true,
  },
  assignedDeveloper: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'Assigned',
  },
  history: [
    {
      typeOfChange: {
        type: String,
        required: true,
      },
      prevValue: {
        type: String,
      },
      newValue: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  comments: [
    {
      //Shouldn't need to manipulate specific comments so probably don't need a separate model for this
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      title: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dateCompleted: {
    type: Date,
  },
  resolutionSummary: {
    type: String,
  },
});

module.exports = Ticket = mongoose.model('Ticket', ticketSchema);
