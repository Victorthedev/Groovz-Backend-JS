const express = require('express');
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, playlistController.getPlaylists);
router.get('/:playlistId', playlistController.getPlaylistSongs);
router.post('/create', auth, playlistController.createPlaylist);

module.exports = router;
