const login = (req, res) => {
    res.redirect('/library');
  };
  
  const logout = (req, res) => {
    req.logout();
    res.redirect('/');
  };
  
  module.exports = { login, logout };