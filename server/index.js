import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config(); // Lädt Umgebungsvariablen aus der .env Datei

const app = express();
app.use(express.json()); // Für das Parsen von JSON-Daten im Body

// Hardcoded Benutzer für das Beispiel
const users = [
  {
    id: 1,
    username: 'testuser',
    password: '$2a$10$QFpnA3O8ZQ.JYo.DMtOLOQHeZmVKZk0Hgcf7Hvv5zzK.d1om.x9ua', // Beispiel für das gehashte Passwort 'password123'
  }
];

// JWT-Secret (kann in der .env-Datei gespeichert werden)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Login-Endpunkt
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Suche den Benutzer
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Benutzer nicht gefunden' });
  }

  // Überprüfe das Passwort
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Falsches Passwort' });
  }

  // Erstelle ein JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  // Sende das JWT zurück
  res.json({ token });
});

// Authentifizierung prüfen (Schutz-Endpunkt)
app.get('/profile', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer Token

  if (!token) {
    return res.status(403).json({ message: 'Keine Authentifizierung' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'Zugriff gewährt', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Ungültiges Token' });
  }
});

// Server starten
app.listen(5000, () => {
  console.log('Server läuft auf http://localhost:5000');
});