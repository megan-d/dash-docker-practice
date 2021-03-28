//Have link to github profile and repos, avatar, and other website links
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const profileSchema = new Schema({
  //Will allow members to search for developers by username, view their profile, and add them to their team
  //Add fields for profile to tell about yourself  (e.g., what technologies you know, what you like to work on, what you'd like to collaborate on)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  bio: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  teams: [
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      captain: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      members: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
  organizations: [
    {
      type: String,
    },
  ],
  myProjects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
  ],
  comments: [
    {
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
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

// profileSchema.plugin(passportLocalMongoose);

module.exports = Profile = mongoose.model('Profile', profileSchema);
