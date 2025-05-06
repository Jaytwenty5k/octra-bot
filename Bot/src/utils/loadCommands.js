import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { Collection } from 'discord.js';
import { client } from './bot.js'; // Passe den Pfad zu deinem Client an

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'src/commands');
const commandFolders = fs.readdirSync(foldersPath);

let totalFiles = 0;
let loadedCommands = 0;
let invalidCommands = 0;

for (const folder of commandFolders) {
  const folderPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
      totalFiles += commandFiles.length;

        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
                try {
                      const commandModule = await import(`file://${filePath}`);
                            const command = commandModule.default || commandModule;

                                  if (!command || !command.data || !command.execute) {
                                          console.log(`❌ Datei ${filePath} enthält kein gültiges Command.`);
                                                  invalidCommands++;
                                                          continue;
                                                                }

                                                                      client.commands.set(command.data.name, command);
                                                                            loadedCommands++;
                                                                                } catch (error) {
                                                                                      console.log(`❌ Fehler beim Laden von ${filePath}:`, error.message);
                                                                                            invalidCommands++;
                                                                                                }
                                                                                                  }
                                                                                                  }

                                                                                                  console.log(`\n✅ Erfolgreich ${loadedCommands} von ${totalFiles} Commands geladen (${invalidCommands} ungültig).`);