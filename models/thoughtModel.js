const { Schema, model } = require('mongoose');
const reactionSchema = require('./reactionModel');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, 'Thought text is required.'],
      minlength: [1, 'Thought must be at least 1 character long.'],
      maxlength: [280, 'Thought cannot exceed 280 characters.']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: [true, 'Username is required.']
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      getters: true
    },
    id: false 
    // prevents mongoose from adding an id field to the model 
  }
);

// virtual property for reactionCount
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
