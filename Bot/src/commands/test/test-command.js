import discord  from 'discord.js';
import { supabase } from '../../utils/supabaseClient.js'; // Pfad ggf. anpassen
import { SlashCommandBuilder } from 'discord.js';
import { embedBuilder } from 'discord.js';

const command = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Testbefehl für den Bot.'),
    async execute(interaction) {
        const embed = new discord.EmbedBuilder()
        .setTitle('Test-Embed')
        .setDescription('Dies ist ein Test-Embed.')
        .setColor('#0099ff')
        .addFields(
            { name: 'Feld 1', value: 'Dies ist das erste Feld.' },
            { name: 'Feld 2', value: 'Dies ist das zweite Feld.' }
        )
        .setFooter({ text: 'Dies ist ein Footer' });
    
        await interaction.reply({ embeds: [embed] });
    },
    };
export { command as default };
