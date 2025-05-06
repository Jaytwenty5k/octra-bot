dein-projektordner/
│
├── src/
│   ├── index.js                     # Hauptdatei (Discord-Bot Einstiegspunkt)
│   ├── utils/
│   │   ├── supabaseClient.js       # Verbindung zu Supabase
│   │   └── helpers.js              # Hilfsfunktionen (z. B. für XP, Level, Formatierungen)
│   │
│   ├── events/
│   │   └── ready.js                # ready-Event
│   │
│   ├── commands/
│   │   ├── economy/
│   │   │   ├── balance.js          # /balance Befehl
│   │   │   ├── daily.js            # /daily Befehl
│   │   │   └── leaderboard.js      # /leaderboard
│   │   │
│   │   ├── jobs/
│   │   │   ├── setjob.js           # /setjob Befehl mit Auswahl
│   │   │   └── work.js             # /work Befehl mit XP-System
│   │   │
│   │   ├── shop/
│   │   │   ├── shop.js             # /shop mit Items, Boosts, Haustieren
│   │   │   └── claim.js            # /claim für z. B. Windrad-Einkommen
│   │   │
│   │   └── general/
│   │       ├── help.js             # /help Befehl
│   │       └── ping.js             # /ping zum Testen
│
├── database/
│   ├── schema.sql                  # SQL-Definitionen für Supabase-Tabellen
│   └── seed-data.sql               # Beispieldaten (optional)
│
├── deploy-commands.js              # Für Slash-Command-Deployment
├── .env                            # Bot-Token und Supabase-Zugangsdaten
├── package.json                    # NPM-Konfiguration
├── README.md                       # Projektbeschreibung (optional)