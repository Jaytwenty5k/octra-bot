const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }

  // Moderation: Automatische Löschung von Nachrichten mit verbotenen Wörtern
  const forbiddenWords = ['spam', 'badword'];
  if (forbiddenWords.some((word) => message.content.toLowerCase().includes(word))) {
    message.delete();
    message.channel.send(`${message.author}, deine Nachricht wurde entfernt, da sie verbotene Wörter enthält.`);
  }

  // Economy-System: Befehl zum Überprüfen des Kontostands
  if (message.content.startsWith('!balance')) {
    const userBalance = 100; // Beispielwert, später dynamisch machen
    message.reply(`Dein Kontostand beträgt ${userBalance} Coins.`);
  }

  // Casino: Einfaches Würfelspiel
  if (message.content.startsWith('!roll')) {
    const roll = Math.floor(Math.random() * 6) + 1;
    message.reply(`Du hast eine ${roll} gewürfelt!`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);