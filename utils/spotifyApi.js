const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '5e3eef3570b74a37af3438268b820e32',
    clientSecret: 'ecda63e51490449d9c94b26f9fd9571a',
    redirectUri: 'http://localhost:4000/auth/callback',
});

module.exports = spotifyApi;