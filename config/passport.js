const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const initializeSpotifyStrategy = () => {
  passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_CALLBACK_URL
  },
  async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
      return done(null, {
        id: profile.id,
        accessToken,
        refreshToken,
        expires_in
      });
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = { initializeSpotifyStrategy };