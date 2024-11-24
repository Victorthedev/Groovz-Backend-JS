const express = require('express');
const spotifyApi = require('../utils/spotifyApi');
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/liked-songs', playlistController.getLikedSongs); 
router.get('/', playlistController.getPlaylists);
router.get('/:playlistId', playlistController.getPlaylistSongs);
router.post('/create', auth, playlistController.createPlaylist);




module.exports = router;
