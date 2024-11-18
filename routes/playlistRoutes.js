const express = require('express');
const playlistController = require('../controllers/playlistController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.get('/', playlistController.getPlaylists);
router.post('/create', playlistController.createPlaylist);

module.exports = router;
