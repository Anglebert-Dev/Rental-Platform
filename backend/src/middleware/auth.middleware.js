const jwt = require('jsonwebtoken');

const authMiddleware = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  },

  isHost: (req, res, next) => {
    if (req.user.role !== 'host') {
      return res.status(403).json({ message: 'Host access required' });
    }
    next();
  }
};

module.exports = authMiddleware;