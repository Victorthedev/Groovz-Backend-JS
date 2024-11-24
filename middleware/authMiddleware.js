const auth = (req, res, next) => {
    const token = req.cookies.spotify_access_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    req.spotifyToken = token;
    next();
  };
  
  module.exports = auth;