import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'src/commands');

// Befehle aus Unterordnern laden
const folderNames = readdirSync(commandsPath);
for (const folder of folderNames) {
  const commandFiles = readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, folder, file);
    const command = await import(`file://${filePath}`);
    if (command.default && command.default.data) {
      commands.push(command.default.data.toJSON());
    } else {
      console.warn(`[WARN] Datei ${filePath} enthält kein gültiges Command.`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log(`Starte das Registrieren von ${commands.length} Slash-Command(s).`);

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands },
  );

  console.log(`Erfolgreich ${commands.length} Slash-Command(s) registriert.`);
} catch (error) {
  console.error(error);
}