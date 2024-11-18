const authenticateToken = (req, res, next) => {
    const accessToken = req.cookies.spotify_access_token;
    
    if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
    }

    spotifyService.setAccessToken(accessToken);
    next();
};

module.exports = authenticateToken;
