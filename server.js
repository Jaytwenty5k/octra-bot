const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Discord OAuth2 routes
app.get('/auth/discord', (req, res) => {
  const redirectUri = encodeURIComponent(
    `${process.env.BASE_URL}/auth/discord/callback`
  );
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
  res.redirect(discordAuthUrl);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.BASE_URL}/auth/discord/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).send(`Error: ${tokenData.error_description}`);
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    req.session.user = userData;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during Discord OAuth2 callback:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Example dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/auth/discord');
  res.send(`Welcome, ${req.session.user.username}!`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});