const spotifyService = require('../services/spotifyService');
const spotifyApi = require('../utils/spotifyApi');

const getPlaylists = async (req, res) => {
    try{
        const playlists = await spotifyService.getUserPlaylists();
        res.json(playlists)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { seedTrackId } = req.body;
        const userId = req.query.userId;
        const seedTrack = await spotifyApi.getTrack(seedTrackId);
        const seedTrackName = seedTrack.body.name;

        const recommendations = await spotifyService.getTrackRecommendations(seedTrackId);
        const trackUris = recommendations.map(track => track.uri);

        const playlistName = 'Music for You';
        const description = `Similar songs to ${seedTrackName}`;
        const playlistId = await spotifyService.createPlaylist(userId, playlistName, description, trackUris);

        res.json({ message: 'Playlist created successfully', playlistId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPlaylists, createPlaylist,
};