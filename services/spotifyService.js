const spotifyApi = require('../utils/spotifyApi');
const User = require('../models/user');
const crypto = require('crypto');

const generateState = () => crypto.randomBytes(16).toString('hex');

const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    const state = generateState();
    return {
        url: spotifyApi.createAuthorizeURL(scopes, state) + '&prompt=consent',
        state,
    };
};

const saveTokens = async (spotifyId, accessToken, refreshToken) => {
    const expiresIn = 3600 * 1000; // 1 hour in milliseconds
    const tokenExpires = new Date(Date.now() + expiresIn);
  
    await User.findOneAndUpdate(
        { spotifyId },
        { spotifyId, accessToken, refreshToken, tokenExpires },
        { upsert: true, new: true }
    );
};

const getValidAccessToken = async (spotifyId) => {
    const user = await User.findOne({ spotifyId });
    if (!user) throw new Error('User not found');

    if (user.tokenExpires > new Date()) return user.accessToken;

    spotifyApi.setRefreshToken(user.refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    user.accessToken = access_token;
    user.tokenExpires = new Date(Date.now() + expires_in * 1000);
    await user.save();

    return access_token;
};

module.exports = {
    getAuthUrl,
    saveTokens,
    getValidAccessToken,
};