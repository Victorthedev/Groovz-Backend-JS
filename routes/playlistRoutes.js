const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
  try {
    const playlists = await req.spotifyApi.getUserPlaylists();
    const likedSongs = await req.spotifyApi.getMySavedTracks();
    
    res.json({
      playlists: playlists.body,
      likedSongs: likedSongs.body
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

router.get('/:playlistId', auth, async (req, res) => {
  const { playlistId } = req.params;
  
  try {
    if (playlistId === 'liked-songs') {
      const likedSongs = await req.spotifyApi.getMySavedTracks();
      res.json({ items: likedSongs.body.items });
    } else {
      const playlist = await req.spotifyApi.getPlaylist(playlistId);
      const tracks = await req.spotifyApi.getPlaylistTracks(playlistId);
      res.json({
        playlist: playlist.body,
        songs: tracks.body.items.map(item => item.track)
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});


router.post('/create', auth, async (req, res) => {
  const { seedTrackId } = req.body;

  try {
    const userProfile = await req.spotifyApi.getMe();
    
    // Add error handling for track info
    const trackInfo = await req.spotifyApi.getTrack(seedTrackId)
      .catch(error => {
        console.error('Track fetch error:', error);
        throw new Error('Failed to fetch seed track');
      });

    const seedTrack = trackInfo.body;

    // Get recommendations with better error handling
// In the recommendations API call, modify it to:
const recommendations = await req.spotifyApi.getRecommendations({
  seed_tracks: [seedTrackId],
  limit: 20,
  market: 'NG'  // Since we can see from your logs you're in Nigeria
}).catch(error => {
  console.error('Recommendations error:', {
    statusCode: error.statusCode,
    body: error.body,
    message: error.message
  });
  throw new Error('Failed to get recommendations');
});

    // Create playlist
    const playlistName = `Based on ${seedTrack.name}`;
    const playlist = await req.spotifyApi.createPlaylist(userProfile.body.id, {
      name: playlistName,
      description: `Created based on ${seedTrack.name} by ${seedTrack.artists[0].name}`,
      public: true
    }).catch(error => {
      console.error('Playlist creation error:', error);
      throw new Error('Failed to create playlist');
    });

    // Add tracks
    const trackUris = recommendations.body.tracks.map(track => track.uri);
    if (trackUris.length > 0) {
      await req.spotifyApi.addTracksToPlaylist(
        playlist.body.id,
        trackUris
      ).catch(error => {
        console.error('Add tracks error:', error);
        throw new Error('Failed to add tracks to playlist');
      });
    }

    res.json({
      success: true,
      playlist: playlist.body
    });
  } catch (error) {
    console.error('Playlist Creation Error:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to create playlist',
      details: error.body || error.message
    });
  }
});

  

module.exports = router;
 