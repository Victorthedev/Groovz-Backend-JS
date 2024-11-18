const BASE_URL = 'https://api.spotify.com/v1';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

const config = {
    clientId: '5e3eef3570b74a37af3438268b820e32',
    clientSecret: 'ecda63e51490449d9c94b26f9fd9571a',
    redirectUri: 'http://localhost:5173/auth/callback'
};

const getAuthUrl = () => {
    const scopes = ['user-library-read', 'playlist-modify-private', 'playlist-modify-public'];
    const params = new URLSearchParams({
        client_id: config.clientId,
        response_type: 'code',
        redirect_uri: config.redirectUri,
        scope: scopes.join(' '),
        state: 'state-key'
    });
    return `${AUTH_URL}?${params.toString()}`;
};

const getAccessToken = async (code) => {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
    });

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64')
        },
        body: params
    });

    return response.json();
};

module.exports = { getAuthUrl, getAccessToken };