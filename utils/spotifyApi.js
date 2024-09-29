const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: ',
    clientSecret: ,
    redirectUri: 'http://localhost:4000/auth/callback',
});

module.exports = spotifyApi;
