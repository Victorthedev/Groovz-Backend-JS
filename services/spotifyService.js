const spotifyApi = require('../utils/spotifyApi');

const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    return spotifyApi.createAuthorizeURL(scopes, 'state-key');
};

const setAccessToken = (accessToken) => {
    spotifyApi.setAccessToken(accessToken);
};

const getUserPlaylists = async () => {
    const data = await spotifyApi.getUserPlaylists();
    return data.body.items;
};

const getTrackRecommendations = async (seedTrackId) => {
    const data = await spotifyApi.getRecommendations({
        seed_tracks: [seedTrackId],
        limit:30,
    });
    return data.body.tracks;
};

const createPlaylist = async (userId, playlistName, description, trackUris) => {
    const playlist = await spotifyApi.createPlaylist(userId, playlistName, { description });
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
    return playlist.body.id;
};

module.exports = {
    getAuthUrl, setAccessToken, getUserPlaylists, getTrackRecommendations, createPlaylist,
};