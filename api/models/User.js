const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  role: {
    type: String,
    default: 'manager',
  },
  //Will allow members to search for developers by username, view their profile, and add them to their team
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
  created: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model('User', userSchema);
