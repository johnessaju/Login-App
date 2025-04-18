require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AuthenticateToken = require('./AuthenticateToken');

const users = [{ name: 'Johnes', password: '$2b$10$abc123...' }];
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser()); // used to parse cookies attached to the request
app.use(
  cors({
    origin: 'https://login.johnessaju.com', // Change this to your frontend port
    credentials: true
  })
);

// Get users
app.get('/', (req, res) => {
  res.json(users);
});

// Register route
app.post('/register', async (req, res) => {
  const user = {
    name: req.body.name,
    password: await bcrypt.hash(req.body.password, 10)
  };
  users.push(user);
  res.status(201).json({ message: 'User created' });
});

// Login route
app.post('/login', async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }
  // compare password given by you with hashed password
  if (await bcrypt.compare(req.body.password, user.password)) {
    // creating a token valid for 30 sec when password is correct
    const accessToken = jwt.sign({ name: user.name }, JWT_SECRET, {
      expiresIn: '30s'
    });
    // creates a refersh token which can have an expiration time to get new access token
    const refreshToken = jwt.sign({ name: user.name }, REFRESH_SECRET);
    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: 'Lax',
      maxAge: 30 * 1000 // 30 seconds
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      username: user.name
    });
  } else {
    res.status(401).json({ error: 'Wrong Password' });
  }
});

// Refresh token route
app.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    // once the refresh token is verified then create a access token
    const newAccessToken = jwt.sign({ name: user.name }, JWT_SECRET, {
      expiresIn: '30s'
    });
    // Adding access token to the response
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 30 * 1000
    });

    res.json({ message: 'Access token refreshed' });
  });
});

// Logout route
app.post('/logout', (req, res) => {
  // clear both cookie
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'Lax'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });

  res.json({ message: 'Logged out successfully' });
});

// Protected route example
// Welcome route with middleware
app.get('/welcome', AuthenticateToken, (req, res) => {
  res.json({ username: req.user.name });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
