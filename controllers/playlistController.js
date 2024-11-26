const SpotifyWebApi = require('spotify-web-api-node');
const spotifyService = require('../services/spotifyService');

const createSpotifyApiInstance = (accessToken) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: '5e3eef3570b74a37af3438268b820e32',
        clientSecret: 'ecda63e51490449d9c94b26f9fd9571a',
        redirectUri: 'http://localhost:4000/auth/callback',
        accessToken: accessToken
    });
    return spotifyApi;
};

const getPlaylists = async (req, res) => {
    try {
        const accessToken = req.cookies.spotify_access_token;
        const spotifyApi = createSpotifyApiInstance(accessToken);
        
        const { offset = 0, limit = 20 } = req.query;
        const playlists = await spotifyService.getUserPlaylists(parseInt(offset), spotifyApi);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLikedSongs = async (req, res) => {
    try {
        const accessToken = req.cookies.spotify_access_token;
        const spotifyApi = createSpotifyApiInstance(accessToken);
        
        const likedSongs = await spotifyService.getLikedSongs(spotifyApi);
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
        const accessToken = req.cookies.spotify_access_token;
        const spotifyApi = createSpotifyApiInstance(accessToken);
        
        const { playlistId } = req.params;
        const playlist = await spotifyService.getPlaylist(playlistId, spotifyApi);
        const tracks = await spotifyService.getPlaylistTracks(playlistId, spotifyApi);
        
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
        const accessToken = req.cookies.spotify_access_token;
        const spotifyApi = createSpotifyApiInstance(accessToken);
        
        const { seedTrackId } = req.body;
        const userId = req.query.userId;
        const playlistId = await spotifyService.createPlaylistFromSeedTrack(userId, seedTrackId, spotifyApi);
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