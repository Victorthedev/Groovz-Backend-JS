const spotifyApi = require('../utils/spotifyApi');

const login = (req, res) => {
  const state = Math.random().toString(36).substring(2, 15);
  const scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-library-read'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  
  // Instead of sending JSON, redirect the user directly
  res.redirect(authorizeURL);
};

const callback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn
    });
  } catch (error) {
    console.error('Error in /callback:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.message
    });
  }
};

const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ error: 'No refresh token provided' });
  }

  try {
    spotifyApi.setRefreshToken(refresh_token);
    const data = await spotifyApi.refreshAccessToken();
    const accessToken = data.body['access_token'];

    res.json({
      access_token: accessToken,
      expires_in: data.body['expires_in']
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token', details: error.message });
  }
};

module.exports = {
  login,
  callback,
  refreshToken
};