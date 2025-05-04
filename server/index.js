import express from 'express';
import axios from 'axios';
import qs from 'qs';

const app = express();

app.get('/auth/discord', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Tausche den Code gegen ein Access-Token aus
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      qs.stringify({
        client_id: 'YOUR_DISCORD_CLIENT_ID',
        client_secret: 'YOUR_DISCORD_CLIENT_SECRET',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://octra-bot.vercel.app/', // gleiche URL wie im OAuth-Link
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Abrufen von Benutzerinformationen
    const userResponse = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userResponse.data;
    // Benutzerinformationen sind nun im `user`-Objekt verfügbar

    // Leite den Benutzer weiter, um die Daten anzuzeigen
    res.redirect(`/dashboard?username=${user.username}&avatar=${user.avatar}`);
  } catch (error) {
    console.error('Error during Discord OAuth:', error);
    res.status(500).send('An error occurred');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});