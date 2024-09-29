const spotifyService = require('../services/spotifyService');
const spotifyApi = require('../utils/spotifyApi');

const login = (req, res) => {
    const authUrl = spotifyService.getAuthUrl();
    res.redirect(authUrl);
};

const callback = async (req, res) => {
    try {
        const code = req.query.code || null;
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        res.cookie('spotify_access_token', access_token, { httpOnly: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    login,
    callback,
};