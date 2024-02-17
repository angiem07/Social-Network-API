const { Thought, User } = require('../models');

const thoughtController = {

  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({})
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(thoughts);
    } catch (err) {
      handleError(res, err);
    }
  },

  // GET one thought by id
  async getThoughtById({ params }, res) {
    try {
      const thought = await Thought.findOne({ _id: params.thoughtId })
        .populate({
          path: "reactions",
          select: "-__v",
        })
        .select("-__v");
      if (!thought) {
        res.status(404).json({ message: "No thought with this id." });
        return;
      }
      res.json(thought);
    } catch (err) {
      handleError(res, err);
    }
  },

  // POST thought
  async createThought({ params, body }, res) {
    try {
      const newThought = await Thought.create(body);
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user found with this id." });
        return;
      }
      res.json(user);
    } catch (err) {
      handleError(res, err);
    }
  },

  // PUT update thought
  async updateThought({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
        new: true,
        runValidators: true,
      });
      if (!updatedThought) {
        res.status(404).json({ message: "No thought found with this id." });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      handleError(res, err);
    }
  },

  // DELETE thought
  async deleteThought({ params }, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: params.thoughtId });
      if (!deletedThought) {
        res.status(404).json({ message: "No thought with this id." });
        return;
      }
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: "No user found with this id." });
        return;
      }
      res.json(user);
    } catch (err) {
      handleError(res, err);
    }
  },

  // POST reaction
  async createReaction({ params, body }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: "No thought found with this id." });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      handleError(res, err);
    }
  },

  // DELETE reaction
  async deleteReaction({ params }, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true, runValidators: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: "No thought found with this id." });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      handleError(res, err);
    }
  },
};

const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = thoughtController;
