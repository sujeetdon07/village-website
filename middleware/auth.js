// middleware/auth.js
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    console.log(`DEBUG: requireAdmin failed - No user in session. Path: ${req.path}`);
    return res.redirect('/login');
  }
  if (!req.session.user.isAdmin) {
    console.log(`DEBUG: requireAdmin failed - User ${req.session.user.mobile} is not Admin. Path: ${req.path}`);
    return res.redirect('/login');
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
