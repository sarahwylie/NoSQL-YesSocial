const router = require('express').Router();
const {
  getAllUser,
  getUserById,
  createUser,
  createFriend,
  updateUser,
  deleteFriend,
  deleteUser
} = require('../../controllers/user-controller');

router
  .route('/')
  .get(getAllUser)
  .post(createUser);

router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router
  .route('/:userId/friends')
  .post(createFriend)

router
  .route('/:userId/friends/:friendId')
  .delete(deleteFriend)
  
module.exports = router;
