const router = require('express').Router();
const {
  userInfoUpdateValidation,
} = require('../middlewares/requestValidation');
const {
  updateUserInfo,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', userInfoUpdateValidation, updateUserInfo);

module.exports = router;
