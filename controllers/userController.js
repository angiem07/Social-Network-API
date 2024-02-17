const { User } = require('../models');

const userController = {

  // GET all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find({})
        .populate([
          {
            path: "thoughts",
            select: "-__v",
          },
          {
            path: "friends",
            select: "-__v"
          }
        ])
        .select("-__v")
        .sort({ _id: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  },

  // GET user by id
  async getUserById({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.id })
        .populate([
          {
            path: "thoughts",
            select: "-__v",
          },
          {
            path: "friends",
            select: "-__v",
          }
        ])
        .select("-__v");
      if (!user) {
        return res.status(404).json({ message: "No user found with this id." });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal server error." });
    }
  },

  // POST user
  async createUser({ body }, res) {
    try {
      const newUser = await User.create(body);
      res.json(newUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // PUT update user
  async updateUser({ params, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with this id." });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE user
  async deleteUser({ params }, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: params.id });
      if (!deletedUser) {
        return res.status(404).json({ message: "No user found with this id." });
      }
      res.json(deletedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // POST friend
  async createFriend({ params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with this id." });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE friend
  async deleteFriend({ params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with this id." });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

module.exports = userController;
