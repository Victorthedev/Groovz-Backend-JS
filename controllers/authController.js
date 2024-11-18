const spotifyApi = require('../utils/spotifyApi');
const spotifyService = require('../services/spotifyService');

const login = (req, res) => {
    try {
        const authUrl = spotifyApi.getAuthUrl();
        console.log('Auth URL:', authUrl);
        res.redirect(authUrl);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message });
    }
};

const callback = async (req, res) => {
    try {
        const code = req.query.code;
        
        if (req.cookies.spotify_access_token) {
            return res.status(200).json({ success: true });
        }

        if (!code) {
            throw new Error('No authorization code received');
        }

        const data = await spotifyApi.getAccessToken(code);
        
        if (!data.access_token) {
            throw new Error('No access token received');
        }

        // Set the access token cookie
        res.cookie('spotify_access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: data.expires_in * 1000 
        });

        if (data.refresh_token) {
            res.cookie('spotify_refresh_token', data.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Callback Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    login,
    callback
};