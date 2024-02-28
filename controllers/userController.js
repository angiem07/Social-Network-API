const { User, Thought } = require('../models');

const userController = {
  // get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).select('-__v').sort({ _id: -1 });
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // get one User by id
  async getUserById({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.id })
        .populate({ path: 'thoughts', select: '-__v' })
        .populate({ path: 'friends', select: '-__v' });

      if (!user) {
        return res.status(404).json({ message: 'No User found with this id!' });
      }
      
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // create User
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // update User by id
  async updateUser({ params, body }, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });

      if (!user) {
        return res.status(404).json({ message: 'No User found with this id!' });
      }
      
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  //Delete user and users associated thoughts
  async deleteUser({ params }, res) {
    try {
      await Thought.deleteMany({ userId: params.id });
      const deletedUser = await User.findOneAndDelete({ _id: params.id });

      if (!deletedUser) {
        return res.status(404).json({ message: 'No User found with this id.' });
      }
      
      res.json(deletedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // add friend
  async addFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'No user found with this id' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  // delete friend
  async deleteFriend({ params }, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'No user found with this id' });
      }

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

module.exports = userController;
