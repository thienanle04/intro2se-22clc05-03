const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({
      data: null,
      message: 'Token is null',
      code: 0
    });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        data: null,
        message: 'Authentication failed',
        code: 0
      });
    }

    req.user = user;
    next(); // Tiếp tục đến middleware hoặc route handler tiếp theo
  });
}

module.exports = authenticateToken;
