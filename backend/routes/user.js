const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const router = express.Router();


router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === 'admin@gmail.com' && password === 'admin123') {
   
      const token = jwt.sign({ role: 'admin' }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, redirectTo: '/admin' });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ id: user._id, role: 'user' }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, redirectTo: '/home' });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', redirectTo: '/home' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
