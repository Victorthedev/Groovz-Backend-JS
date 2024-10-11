const spotifyApi = require('../utils/spotifyApi');

const callSpotifyApi = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    if (error.statusCode === 401) {
      // Token has expired, refresh it
      const refreshToken = spotifyApi.getRefreshToken();
      const data = await spotifyApi.refreshAccessToken();
      spotifyApi.setAccessToken(data.body['access_token']);
      
      // Retry the API call
      return await apiCall();
    } else {
      throw error;
    }
  }
};

const getAuthUrl = () => {
  const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
  return spotifyApi.createAuthorizeURL(scopes, 'state-key');
};

const setAccessToken = (accessToken) => {
  spotifyApi.setAccessToken(accessToken);
};

const getUserPlaylists = async (offset = 0, limit = 20) => {
  const playlistsResponse = await callSpotifyApi(() => spotifyApi.getUserPlaylists({ offset, limit }));
  const playlists = playlistsResponse.body.items;

  const likedSongsResponse = await callSpotifyApi(() => spotifyApi.getMySavedTracks({ offset, limit }));
  const likedSongs = likedSongsResponse.body.items.map(item => item.track);

  return {
    playlists,
    likedSongs,
  };
};

const fetchLikedSongs = async (req, res) => {
  try {
    const likedSongs = await callSpotifyApi(() => spotifyApi.getMySavedTracks());
    res.json(likedSongs.body.items.map(item => item.track));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTrackRecommendations = async (seedTrackId) => {
  const response = await callSpotifyApi(() => spotifyApi.getRecommendations({
    seed_tracks: [seedTrackId],
    limit: 10,
  }));
  return response.body.tracks;
};

const createPlaylist = async (userId, name, description, trackUris) => {
  const playlistResponse = await callSpotifyApi(() => spotifyApi.createPlaylist(userId, {
    name,
    description,
  }));

  const playlistId = playlistResponse.body.id;
  await callSpotifyApi(() => spotifyApi.addTracksToPlaylist(playlistId, trackUris));

  return playlistId;
};

const createPlaylistFromSeedTrack = async (userId, seedTrackId) => {
  const seedTrack = await callSpotifyApi(() => spotifyApi.getTrack(seedTrackId));
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
  fetchLikedSongs,
  getTrackRecommendations,
  createPlaylistFromSeedTrack,
};