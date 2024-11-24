const spotifyApi = require('../utils/spotifyApi');

const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    return spotifyApi.createAuthorizeURL(scopes, 'state-key');
};

const setAccessToken = (accessToken) => {
    spotifyApi.setAccessToken(accessToken);
};

const getUserPlaylists = async (offset = 0) => {
    const response = await spotifyApi.getUserPlaylists({ offset });
    return response.body;
};

const getPlaylist = async (playlistId) => {
    const response = await spotifyApi.getPlaylist(playlistId);
    return response.body;
};

const getPlaylistTracks = async (playlistId) => {
    const response = await spotifyApi.getPlaylistTracks(playlistId);
    return response.body;
};

const getTrackRecommendations = async (seedTrackId) => {
    const response = await spotifyApi.getRecommendations({
        seed_tracks: [seedTrackId],
        limit: 10,
    });
    return response.body.tracks;
};

const createPlaylist = async (userId, name, description, trackUris) => {
    const playlistResponse = await spotifyApi.createPlaylist(userId, {
        name,
        description,
    });

    const playlistId = playlistResponse.body.id;
    await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

    return playlistId;
};

const createPlaylistFromSeedTrack = async (userId, seedTrackId) => {
    const seedTrack = await spotifyApi.getTrack(seedTrackId);
    const seedTrackName = seedTrack.body.name;

    const recommendations = await getTrackRecommendations(seedTrackId);
    const trackUris = recommendations.map(track => track.uri);

    const playlistName = 'Groovz';
    const description = `Similar songs to ${seedTrackName}`;

    const playlistId = await createPlaylist(userId, playlistName, description, trackUris);
    return playlistId;
};

module.exports = {
    getAuthUrl,
    setAccessToken,
    getUserPlaylists,
    getPlaylist,
    getPlaylistTracks,
    getTrackRecommendations,
    createPlaylistFromSeedTrack,
};
