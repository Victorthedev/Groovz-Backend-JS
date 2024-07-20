const express = require('express');
const playlistController = require('../controllers/playlistController');

const router = express.Router();

router.get('/', playlistController.getPlaylists);
router.post('/create', playlistController.createPlaylist);

module.exports = router;
