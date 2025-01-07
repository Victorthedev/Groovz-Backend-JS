const SpotifyWebApi = require('spotify-web-api-node');

const auth = async (req, res, next) => {
  const { access_token } = req.cookies;
  
  if (!access_token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Create new instance for each request
    req.spotifyApi = new SpotifyWebApi({
      clientId: '5e3eef3570b74a37af3438268b820e32',
      clientSecret: 'ecda63e51490449d9c94b26f9fd9571a',
      redirectUri: 'http://localhost:4000/auth/callback',
    });
    
    req.spotifyApi.setAccessToken(access_token);
    await req.spotifyApi.getMe(); // Verify token is valid
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;