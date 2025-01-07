const express = require('express');
const router = express.Router();
const spotifyApi = require('../utils/spotifyApi');

router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'playlist-modify-public','playlist-modify-private', 'user-library-read'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    
    // Set tokens in cookies
    res.cookie('access_token', access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hour
    });
    
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 3600000 // 30 days
    });

    // Get user profile
    spotifyApi.setAccessToken(access_token);
    const userProfile = await spotifyApi.getMe();
    
    res.redirect('http://localhost:5173/home');

  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;
