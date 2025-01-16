const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const SpotifyAPI = require('../utils/spotify');

router.get('/', ensureAuth, async (req, res) => {
  try {
    const spotify = new SpotifyAPI(req.user.accessToken);
    const playlists = await spotify.getUserLibrary();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/liked-songs', ensureAuth, async (req, res) => {
  try {
    const spotify = new SpotifyAPI(req.user.accessToken);
    const likedSongs = await spotify.getLikedSongs();
    res.json(likedSongs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:playlistId', ensureAuth, async (req, res) => {
  try {
    const spotify = new SpotifyAPI(req.user.accessToken);
    const tracks = await spotify.getPlaylistTracks(req.params.playlistId);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;