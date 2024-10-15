const spotifyService = require('../services/spotifyService');

const getPlaylists = async (req, res) => {
    try {
        const spotifyId = req.cookies.spotify_id;
        const accessToken = await spotifyService.getValidAccessToken(spotifyId);
        spotifyService.setAccessToken(accessToken);
        
        const playlists = await spotifyService.getUserPlaylists();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { seedTrackId } = req.body;
        const spotifyId = req.cookies.spotify_id;
        const accessToken = await spotifyService.getValidAccessToken(spotifyId);
        spotifyService.setAccessToken(accessToken);
        
        const playlistId = await spotifyService.createPlaylistFromSeedTrack(spotifyId, seedTrackId);
        res.json({ message: 'Playlist created successfully', playlistId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlaylists,
    createPlaylist,
};