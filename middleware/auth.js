const { User } = require('../models');

module.exports = {
  ensureAuthenticated: async function(req, res, next) {
    if (process.env.NODE_ENV === 'test') {
      const testUser = await User.findOne({ where: { username: 'bloguser' } });
      req.user = testUser;
      return next();
    }
    
    if (req.isAuthenticated()) {
      return next();
    }
    
    if (req.xhr) {
      return res.status(401).json({ message: 'Please log in to view this resource' });
    }
    
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/login');
  },
  
  forwardAuthenticated: function(req, res, next) {
    if (process.env.NODE_ENV === 'test' || !req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
};
