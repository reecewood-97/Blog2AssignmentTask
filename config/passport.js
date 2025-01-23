const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      username = username?.trim();
      password = password?.trim();

      if (!username || !password) {
        return done(null, false, { message: 'Please enter both username and password' });
      }

      const user = await User.findOne({ 
        where: { username },
        raw: false
      });
      
      if (!user) {
        return done(null, false, { message: 'No user found with that username' });
      }

      const isMatch = await user.validatePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      console.error('Passport authentication error:', err);
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      console.error('Passport deserialization error:', err);
      done(err);
    }
  });
};
