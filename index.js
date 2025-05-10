import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config(); // Lädt die Umgebungsvariablen

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(filePath);
        client.commands.set(command.data.name, command);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return interaction.reply({ content: 'Befehl nicht gefunden.', ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Fehler beim Ausführen des Befehls:', error);
        await interaction.reply({ content: 'Es gab ein Problem beim Ausführen des Befehls.', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Bot ist online als ${client.user.tag}`);
});

async function startBot() {
    await loadCommands();
    await client.login(process.env.DISCORD_TOKEN);
    console.log('Bot erfolgreich gestartet!');
}

startBot();
