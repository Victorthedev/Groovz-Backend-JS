const spotifyApi = require('../utils/spotifyApi');

const path = require('path');
const playlistImages = [
    path.join(__dirname, '../images/1.jpg'),
    path.join(__dirname, '../images/2.jpg'),
    path.join(__dirname, '../images/3.jpg'),
    path.join(__dirname, '../images/4.jpg')
];


const convertImageToBase64 = async (imagePath) => {
    const fs = require('fs').promises;
    const buffer = await fs.readFile(imagePath);
    return buffer.toString('base64');
};


const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    return spotifyApi.createAuthorizeURL(scopes, 'state-key');
};

const setAccessToken = (accessToken) => {
    spotifyApi.setAccessToken(accessToken);
};

const getUserPlaylists = async (offset = 0) => {
    const playlistResponse = await spotifyApi.getUserPlaylists({ offset });
    
    const likedSongsResponse = await spotifyApi.getMySavedTracks();
    
    return {
        playlists: playlistResponse.body,
        likedSongs: likedSongsResponse.body
    };
};

const getLikedSongs = async () => {
    try {
        const response = await spotifyApi.getMySavedTracks({
            limit: 50,
            offset: 0  
        });
        return response.body;
    } catch (error) {
        console.error('Error fetching liked songs:', error);
        if (error.statusCode) {
            throw new Error(`Spotify API error: ${error.statusCode} - ${error.message}`);
        }
        throw error;
    }
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
    const seedTrackFeatures = await spotifyApi.getAudioFeaturesForTrack(seedTrackId);
    
    const response = await spotifyApi.getRecommendations({
        seed_tracks: [seedTrackId],
        limit: 100,
        target_instrumentalness: seedTrackFeatures.body.instrumentalness,
        target_acousticness: seedTrackFeatures.body.acousticness,
        min_instrumentalness: Math.max(0, seedTrackFeatures.body.instrumentalness - 0.2),
        max_instrumentalness: Math.min(1, seedTrackFeatures.body.instrumentalness + 0.2),
        target_key: seedTrackFeatures.body.key,
        target_mode: seedTrackFeatures.body.mode,
        target_time_signature: seedTrackFeatures.body.time_signature,
        min_popularity: 20, 
    });

    const tracks = response.body.tracks;
    let totalDurationMs = 0;
    const TARGET_DURATION_MS = 60 * 60 * 1000;
    const MARGIN_MS = 2 * 60 * 1000;
    const selectedTracks = [];

    for (const track of tracks) {
        if (totalDurationMs + track.duration_ms <= TARGET_DURATION_MS + MARGIN_MS) {
            selectedTracks.push(track);
            totalDurationMs += track.duration_ms;
        }
        
        if (totalDurationMs >= TARGET_DURATION_MS - MARGIN_MS) {
            break;
        }
    }

    return selectedTracks;
};

const createPlaylist = async (userId, name, description, trackUris) => {
    const playlistResponse = await spotifyApi.createPlaylist(userId, {
        name,
        description,
    });

    const playlistId = playlistResponse.body.id;
    await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

    const randomImageIndex = Math.floor(Math.random() * playlistImages.length);
    const imagePath = playlistImages[randomImageIndex];
    
    const imageData = await convertImageToBase64(imagePath);
    await spotifyApi.uploadCustomPlaylistCoverImage(playlistId, imageData);

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
    getLikedSongs,
    getPlaylist,
    getPlaylistTracks,
    getTrackRecommendations,
    createPlaylistFromSeedTrack,
};
