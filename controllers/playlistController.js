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

const getLikedSongs = async (req, res) => {
    try {
        const likedSongs = await spotifyService.getLikedSongs();
        res.json(likedSongs);
    } catch (error) {
        console.error('Error in getLikedSongs controller:', error);
        res.status(error.statusCode || 500).json({
            error: error.message || 'An error occurred while fetching liked songs'
        });
    }
};

const getPlaylistSongs = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await spotifyService.getPlaylist(playlistId);
        const tracks = await spotifyService.getPlaylistTracks(playlistId);
        
        res.json({
            playlist: playlist,
            songs: tracks.items.map(item => item.track)
        });
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
    getLikedSongs,
    getPlaylistSongs,
    createPlaylist,
};
