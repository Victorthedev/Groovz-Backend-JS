const express = require('express');
const router = express.Router();
const passport = require('passport');
const { login, logout } = require('../controller/authController');

router.get('/spotify', passport.authenticate('spotify', {
  scope: ['user-library-read', 'playlist-read-private', 'playlist-modify-public']
}));

router.get('/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/home');
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/login');
  });
});


module.exports = router;