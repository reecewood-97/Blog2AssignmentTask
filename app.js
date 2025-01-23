const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const { sequelize } = require('./models');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

require('./config/passport')(passport);

app.use('/auth', require('./routes/auth'));
app.use('/blog', require('./routes/blog'));

app.get('/', (req, res) => {
  res.redirect('/blog');
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Database sync error:', err);
  });
}

module.exports = app;
