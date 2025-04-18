require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

function AuthenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!token) {
    // Try refreshing if token is missing but refreshToken is present
    if (refreshToken) {
      return refreshAccessToken(refreshToken, req, res, next);
    } else {
      return res.sendStatus(401); // No access token and no refresh token
    }
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
// clearing cookie in response
      res.clearCookie('accessToken');

      // Try refreshing if access token is invalid and refreshToken exists
      if (refreshToken) {
        return refreshAccessToken(refreshToken, req, res, next);
      } else {
        return res.status(403).json({ message: 'Access token expired or invalid' });
      }
    }

    req.user = user;
    next(); // Valid access token, continue
  });
}

function refreshAccessToken(refreshToken, req, res, next) {
  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }

    const newAccessToken = jwt.sign({ name: user.name }, JWT_SECRET, {
      expiresIn: '30s'
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false, // set to true in production (HTTPS)
      sameSite: 'Lax',
      maxAge: 30 * 1000
    });

    req.user = user;
    next(); // Continue after refreshing token
  });
}

module.exports = AuthenticateToken;
