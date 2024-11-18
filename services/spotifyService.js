let accessToken = null;

const makeSpotifyRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
    }
    
    return response.json();
};

const setAccessToken = (token) => {
    accessToken = token;
};

const getUserPlaylists = async (offset = 0, limit = 20) => {
    return makeSpotifyRequest(`/me/playlists?offset=${offset}&limit=${limit}`);
};

const getTrackRecommendations = async (seedTrackId) => {
    const params = new URLSearchParams({
        seed_tracks: seedTrackId,
        limit: 10
    });
    return makeSpotifyRequest(`/recommendations?${params.toString()}`);
};

const getTrack = async (trackId) => {
    return makeSpotifyRequest(`/tracks/${trackId}`);
};

const createPlaylist = async (userId, name, description) => {
    return makeSpotifyRequest(`/users/${userId}/playlists`, {
        method: 'POST',
        body: JSON.stringify({ name, description })
    });
};

const addTracksToPlaylist = async (playlistId, trackUris) => {
    return makeSpotifyRequest(`/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ uris: trackUris })
    });
};

const createPlaylistFromSeedTrack = async (userId, seedTrackId) => {
    const seedTrack = await getTrack(seedTrackId);
    const recommendations = await getTrackRecommendations(seedTrackId);
    const trackUris = recommendations.tracks.map(track => track.uri);

    const playlistName = 'Groovz';
    const description = `Similar songs to ${seedTrack.name}`;

    const playlist = await createPlaylist(userId, playlistName, description);
    await addTracksToPlaylist(playlist.id, trackUris);

    return playlist.id;
};

module.exports = {
    setAccessToken,
    getUserPlaylists,
    getTrackRecommendations,
    createPlaylistFromSeedTrack
};