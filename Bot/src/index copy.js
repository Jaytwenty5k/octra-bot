import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
config(); // Für .env-Datei

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Rekursive Funktion zum Laden aller .js-Dateien in Unterordnern
function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      loadCommands(filePath); // Ordner rekursiv durchsuchen
    } else if (file.endsWith('.js')) {
      import(filePath).then((commandModule) => {
        const command = commandModule.default || commandModule;
        if (command?.data?.name) {
          client.commands.set(command.data.name, command);
        } else {
          console.warn(`Datei ${filePath} enthält kein gültiges Command.`);
        }
      }).catch(console.error);
    }
  }
}

// Alle Befehle laden
const commandsPath = path.join(__dirname, 'src/commands');
loadCommands(commandsPath);

client.once('ready', () => {
  console.log(`Bot ist online als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Fehler bei der Ausführung des Befehls.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);