const express = require('express');
const { check } = require('express-validator');
const { signup,login   } = require('../controllers/authController');


const router = express.Router();

router.post(
  '/signup',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  signup
);

router.post('/login', login);

module.exports = router;
