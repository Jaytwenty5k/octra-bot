import discord from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { embedBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('credits')
        .setDescription('Zeigt die Credits der Mitwirkenden dieses Projekts an.'),
    async execute(interaction) {
        const embed = new discord.EmbedBuilder()
        .setTitle('Credits')
        .setDescription('Dies zeigt dir die Mitwirkenden dieses Projekts an.')
        .setColor('#0099ff')
        .addFields(
            { name: 'Owner', value: '@jay_twenty4k' },
            { name: 'Developer', value: '...' },
            { name: 'Moderator', value: '...' },
            { name: 'Management', value: '...' },
            { name: 'Designer', value: '...' },
            { name: 'Tester', value: '...' },
            { name: 'Supporter', value: '...' },
            { name: 'Helper', value: '...' },
            { name: 'Bot-Tester', value: '...' },
            { name: 'Bot-Entwickler', value: '...' },
            { name: 'Bot-Designer', value: '...' },
            { name: 'Bot-Manager', value: '...' },
            { name: 'Bot-Supporter', value: '...' },
            { name: 'Bot-Helper', value: '...' },
            { name: 'Bot-Tester', value: '...' },
            { name: 'Contributer', value: '...' }
        )
        .setFooter({ text: 'Das ist unser Team' });
    
        await interaction.reply({ embeds: [embed] });
    },
};