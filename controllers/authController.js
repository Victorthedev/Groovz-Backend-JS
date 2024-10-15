const spotifyService = require('../services/spotifyService');
const spotifyApi = require('../utils/spotifyApi');
const axios = require('axios');

const login = (req, res) => {
  const { url, state } = spotifyService.getAuthUrl();
  req.session.state = state; // Store state in session
  console.log('Stored state in session:', req.session.state);
  res.redirect(url);
};

const callback = async (req, res) => {
    const { code, state } = req.body; // This should be from the request body.

    try {
        console.log('Callback received with code:', code, 'and state:', state);
        console.log('Stored state in session:', req.session.state);

        if (!code || state !== req.session.state) {
            throw new Error('Invalid authentication request'); // This will trigger if state is undefined.
        }

      // Set your redirect URI
      const redirectUri = 'http://localhost:5173/auth/callback'; // Ensure this matches what's in your Spotify app settings

      // Create the POST request body
      const body = new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
      });

      const SPOTIFY_CLIENT_ID = '5e3eef3570b74a37af3438268b820e32'; // Replace with your actual client ID
      const SPOTIFY_CLIENT_SECRET = 'ecda63e51490449d9c94b26f9fd9571a'; // Replace with your actual client secret
      
      const authOptions = {
          headers: {
              'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      };

      // Exchange the code for an access token
      const response = await axios.post('https://accounts.spotify.com/api/token', body.toString(), authOptions);
      
      const { access_token, refresh_token } = response.data;

      if (!access_token) throw new Error('Access token not received from Spotify');

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      const userProfile = await spotifyApi.getMe();
      const spotifyId = userProfile.body.id;

      await spotifyService.saveTokens(spotifyId, access_token, refresh_token);

      res.cookie('spotify_id', spotifyId, { httpOnly: true });
      res.status(200).json({ success: true, spotifyId });
  } catch (error) {
      console.error('Spotify callback error:', error);
      res.status(500).json({
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
  }
};

module.exports = {
    login,
    callback,
};