const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [ /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address']
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// virtual property for friendCount
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// hook calls before saving to ensure unique email and username
UserSchema.pre('save', async function (next) {
  try {
    const user = this;
    const existingUser = await User.findOne({ $or: [{ username: user.username }, { email: user.email }] });
    if (existingUser) {
      if (existingUser.username === user.username) {
        throw new Error('Username already exists');
      }
      if (existingUser.email === user.email) {
        throw new Error('Email already exists');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = model('User', UserSchema);

module.exports = User;
