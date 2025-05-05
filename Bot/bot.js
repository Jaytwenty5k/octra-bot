import { Client, GatewayIntentBits } from 'discord.js';
import { data as setjobData, execute as setjobExecute } from './src/commands/setjob';
import { data as claimData, execute as claimExecute } from './src/commands/claim';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'setjob') {
    await setjobExecute(interaction);
  } else if (interaction.commandName === 'claim') {
    await claimExecute(interaction);
  }
});

client.login('your-bot-token-here');