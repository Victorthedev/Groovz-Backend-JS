const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const SpotifyAPI = require('../utils/spotify');

router.post('/create', ensureAuth, async (req, res) => {
  try {
    const { songData } = req.body;
    console.log('Received songData:', songData);
    
    const spotify = new SpotifyAPI(req.user.accessToken);
    const userProfile = await spotify.getCurrentUser();
    console.log('User profile:', userProfile);
    
    const userId = userProfile.id;
    console.log('Creating playlist for user:', userId);
    
    const playlist = await spotify.createPlaylist(userId, songData);
    res.json(playlist);
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;