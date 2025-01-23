const express = require('express');
const router = express.Router();
const { Blog, User } = require('../models');
const { Op, fn, col } = require('sequelize');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    let searchCondition = {};
    if (search) {
      searchCondition = {
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { content: { [Op.like]: `%${search}%` } }
          ]
        }
      };
    }

    let sortCondition = [];
    if (sort) {
      const [field, direction] = sort.split(',');
      const order = direction ? direction.toUpperCase() : 'ASC';
      if (['title', 'createdAt'].includes(field)) {
        sortCondition = [[field, order]];
      }
    }

    const posts = await Blog.findAll({
      ...searchCondition,
      include: [{ model: User, attributes: ['username'] }],
      order: sortCondition.length ? sortCondition : [['createdAt', 'DESC']]
    });

    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(200).json({ posts });
    }

    res.render('index', {
      title: 'Home',
      posts,
      search: search || '',
      sort: sort || ''
    });
  } catch (err) {
    console.error(err);
    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(500).json({ error: 'Error loading posts' });
    }
    req.flash('error_msg', 'Error loading posts');
    res.redirect('/');
  }
});

router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create', { title: 'Create Post' });
});

router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const errors = [];

    if (!title || !content) {
      errors.push({ msg: 'Please fill in all fields' });
    }

    if (errors.length > 0) {
      if (req.xhr || process.env.NODE_ENV === 'test') {
        return res.status(400).json({ errors });
      }
      return res.render('create', {
        errors,
        title: 'Create Post',
        postTitle: title,
        content
      });
    }

    const post = await Blog.create({
      title,
      content,
      userId: req.user.id
    });

    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(201).json({ post });
    }

    req.flash('success_msg', 'Post created successfully');
    res.redirect('/blog');
  } catch (err) {
    console.error(err);
    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(500).json({ error: 'Error creating post' });
    }
    req.flash('error_msg', 'Error creating post');
    res.redirect('/blog/create');
  }
});

router.get('/stats', ensureAuthenticated, async (req, res) => {
  try {
    const totalPosts = await Blog.count();
    const userPosts = await Blog.count({ where: { userId: req.user.id } });
    const recentPosts = await Blog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const stats = {
      totalPosts,
      userPosts,
      recentPosts
    };

    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(200).json(stats);
    }

    res.render('stats', {
      title: 'Blog Statistics',
      stats
    });
  } catch (err) {
    console.error(err);
    if (req.xhr || process.env.NODE_ENV === 'test') {
      return res.status(500).json({ error: 'Error loading stats' });
    }
    req.flash('error_msg', 'Error loading stats');
    res.redirect('/blog');
  }
});

module.exports = router;

