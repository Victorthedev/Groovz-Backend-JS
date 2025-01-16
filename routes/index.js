const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const libraryRoutes = require('./library');
const playlistRoutes = require('./playlist');

router.use('/auth', authRoutes);
router.use('/library', libraryRoutes);
router.use('/playlist', playlistRoutes);

module.exports = router;