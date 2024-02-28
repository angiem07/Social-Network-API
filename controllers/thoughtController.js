const { User, Thought } = require('../models');

const thoughtController = {
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .sort({ _id: -1 });
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // get one thought by id
  async getThoughtById({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v');
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that id!' });
      }
      
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // create thought
  async createThought({ body }, res) {
    try {
      const thought = await Thought.create(body);
      await User.findOneAndUpdate({ _id: body.userId }, { $push: { thoughts: thought._id } }, { new: true });
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // update thought by id
  async updateThought({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
      
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with that id!' });
      }
      
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // delete thought by ID
  async deleteThought({ params }, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: params.id });
      
      if (!deletedThought) {
        return res.status(404).json({ message: 'No thought found with that id!' });
      }
      
      await User.findOneAndUpdate({ _id: params.userId }, { $pull: { thoughts: params.id } }, { new: true });
      
      res.json(deletedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // create reaction
  async createReaction({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      ).populate({ path: 'reactions', select: '-__v' }).select('-__v');

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID.' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // delete reaction
  async deleteReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought found with this ID.' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

module.exports = thoughtController;
