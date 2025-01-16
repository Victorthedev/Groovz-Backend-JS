const axios = require('axios');

class SpotifyAPI {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: 'https://api.spotify.com/v1',
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  }

  async getCurrentUser() {
    const response = await this.api.get('/me');
    return response.data;
  }


  async getUserLibrary() {
    const response = await this.api.get('/me/playlists');
    return response.data.items;
  }

  async getPlaylistTracks(playlistId) {
    const response = await this.api.get(`/playlists/${playlistId}/tracks`);
    return response.data.items;
  }

  async getLikedSongs() {
    const response = await this.api.get('/me/tracks');
    return response.data.items;
  }

  async createPlaylist(userId, songData) {
    try {
      // Create playlist
      const playlist = await this.api.post(`/me/playlists`, {
        name: 'Groovz',
        description: `Based on ${songData.name} by ${songData.artists[0].name}`
      });
      console.log('Playlist created:', playlist.data);
  
      // Debug log before recommendations request
      console.log('Requesting recommendations with:', {
        seedTrack: songData.id,
        token: this.api.defaults.headers['Authorization']
      });
  
      // Get recommendations
      const recommendations = await this.api.get('/recommendations', {
        params: {
          seed_tracks: songData.id,
          limit: 10
        }
      });
  
      console.log('Got recommendations:', recommendations.data);
  
      // Add tracks to playlist
      if (recommendations.data.tracks && recommendations.data.tracks.length > 0) {
        await this.api.post(`/playlists/${playlist.data.id}/tracks`, {
          uris: recommendations.data.tracks.map(track => `spotify:track:${track.id}`)
        });
      }
  
      return playlist.data;
    } catch (error) {
      // More detailed error logging
      console.error('Full error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      throw error;
    }
  
  }
}  

module.exports = SpotifyAPI;