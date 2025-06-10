const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;

  try {
    if (await User.findOne({ email })) 
      return res.status(400).json({ message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await new User({ username, email, password: hashedPassword }).save();

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password))) 
      return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
