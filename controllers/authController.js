const spotifyService = require('../services/spotifyService');
const spotifyApi = require('../utils/spotifyApi');

const login = (req, res) => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    const authUrl = spotifyService.getAuthUrl(scopes);
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
        res.redirect('https://main.d1n7z7zw3v28b1.amplifyapp.com/home');
    } catch (error) {
        res.redirect('https://main.d1n7z7zw3v28b1.amplifyapp.com/login?error=auth_failed');
    }
};

module.exports = {
    login,
    callback,
};