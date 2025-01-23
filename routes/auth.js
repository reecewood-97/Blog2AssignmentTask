const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require('../models');
const { forwardAuthenticated } = require('../middleware/auth');

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;
    const errors = [];

    if (!username || !email || !password || !password2) {
      errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(400).json({ errors });
      }
      return res.render('register', {
        errors,
        username,
        email
      });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
      }
      return res.render('register', {
        errors: [{ msg: 'Username already exists' }],
        username,
        email
      });
    }

    await User.create({
      username,
      email,
      password
    });

    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(201).json({ message: 'Registration successful' });
    }

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Registration error:', err);
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.status(500).json({ error: 'Registration failed' });
    }
    req.flash('error_msg', 'Registration failed');
    res.redirect('/auth/register');
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err);
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      req.flash('error_msg', 'Login error');
      return res.redirect('/auth/login');
    }
    
    if (!user) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(401).json({ message: info.message || 'Authentication failed' });
      }
      req.flash('error_msg', info.message || 'Authentication failed');
      return res.redirect('/auth/login');
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        if (req.xhr || req.headers.accept?.includes('json')) {
          return res.status(500).json({ message: 'Login error' });
        }
        req.flash('error_msg', 'Login error');
        return res.redirect('/auth/login');
      }

      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(200).json({ message: 'Login successful' });
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router;
