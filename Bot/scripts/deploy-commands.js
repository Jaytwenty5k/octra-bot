import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

config(); // Lädt .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'Bot', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;
      commands.push(command.data.toJSON());
      }

      const rest = new REST().setToken(process.env.TOKEN);

      try {
        console.log('Lade Slash-Befehle hoch...');

          await rest.put(
              Routes.applicationCommands(process.env.CLIENT_ID),
                  { body: commands },
                    );

                      console.log('Slash-Befehle erfolgreich hochgeladen!');
                      } catch (error) {
                        console.error(error);
                        }