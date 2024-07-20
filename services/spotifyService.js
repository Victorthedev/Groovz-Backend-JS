const spotifyApi = require('../utils/spotifyApi');

const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    return spotifyApi.createAuthorizeURL(scopes, 'state-key');
};

const setAccessToken = (accessToken) => {
    spotifyApi.setAccessToken(accessToken);
};

const getUserPlaylists = async (offset = 0, limit = 20) => {
    const response = await spotifyApi.getUserPlaylists({ offset, limit });
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

    const playlistName = 'Music for You';
    const description = `Similar songs to ${seedTrackName}`;

    const playlistId = await createPlaylist(userId, playlistName, description, trackUris);
    return playlistId;
};

module.exports = {
    getAuthUrl,
    setAccessToken,
    getUserPlaylists,
    getTrackRecommendations,
    createPlaylistFromSeedTrack,
};
