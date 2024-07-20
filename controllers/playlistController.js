const spotifyService = require('../services/spotifyService');

const getPlaylists = async (req, res) => {
    try {
        const { offset = 0, limit = 20 } = req.query;
        const playlists = await spotifyService.getUserPlaylists(parseInt(offset), parseInt(limit));
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { seedTrackId } = req.body;
        const userId = req.query.userId;
        const playlistId = await spotifyService.createPlaylistFromSeedTrack(userId, seedTrackId);
        res.json({ message: 'Playlist created successfully', playlistId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlaylists,
    createPlaylist,
};
