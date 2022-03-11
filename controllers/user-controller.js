const { User } = require('../models');

const userController = {
    //get all users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err)
                res.status(400).json(err);
            });
    },
    //get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    //create a user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err))
    },
    //add new friends
    createFriend({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: params.friendId },
                        { $push: { friends: _id } },
                        { new: true }
                    );
                })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found with that ID!' });
                        return;
                    }
                    res.json(dbUserData)
                })
                .catch(err => res.json(err));
        },
    //update user by ID
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err))
    },
    //delete friends from user's friend list
    deleteFriend({ params }, res) {
        User.findOneAndDelete({ _id: params.friendId })
        .then(deletedFriend => {
            if (!deletedFriend) {
                return res.status(404).json({ message: 'No friend found with this ID!' })
            }
        })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err))
    },
    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought found with this ID!' })
            }
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
        })
            .then(dbUserData =>
                // if (!dbUserData) {
                //     res.status(404).json({ message: 'No user found with this ID!' });
                //     return;
                // }
                res.json(dbUserData))
            .catch(err => res.status(400).json(err))
    }
};

module.exports = userController;