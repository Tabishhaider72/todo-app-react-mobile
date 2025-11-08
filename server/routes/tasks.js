const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.userId = data.id;
    next();
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
};

// CRUD
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  const t = await Task.create({ user: req.userId, title });
  res.json(t);
});
router.put('/:id', auth, async (req, res) => {
  const t = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
  res.json(t);
});
router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ ok: true });
});

module.exports = router;
