import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Lädt Umgebungsvariablen aus der .env Datei

const app = express();

// Discord OAuth2 Client-ID und Secret
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;  // Beispiel: http://localhost:5000/discord/callback

// Schritt 1: Weiterleitung zu Discords OAuth2
app.get('/discord/login', (req, res) => {
  const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`;
  res.redirect(redirectUrl);
});

// Schritt 2: Callback von Discord nach der Autorisierung
app.get('/discord/callback', async (req, res) => {
  const { code } = req.query;

  // Tausche den Code gegen ein Access-Token
  try {
    const response = await axios.post('https://discord.com/api/oauth2/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify',
      },
    });

    const { access_token } = response.data;

    // Mit dem Access-Token benutzerdaten abrufen
    const userData = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Speichere das Access-Token und Benutzerdaten in der Sitzung oder sende sie im Response zurück
    // Hier speichern wir es als Token in der Session (Optional: Kann auch im Frontend gespeichert werden)
    req.session.access_token = access_token;

    // Benutzername und Profilbild an den Client senden
    res.json({
      username: userData.data.username,
      avatarUrl: `https://cdn.discordapp.com/avatars/${userData.data.id}/${userData.data.avatar}.png`,
    });

  } catch (error) {
    console.error('Error during Discord authentication:', error);
    res.status(500).json({ message: 'Fehler bei der Authentifizierung' });
  }
});

// Server starten
app.listen(5000, () => {
  console.log('Server läuft auf http://localhost:5000');
});