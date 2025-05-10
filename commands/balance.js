import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../database/supabase.js';

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Zeigt deinen Kontostand an.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const { data: user, error } = await supabase
        .from('users')
        .select('username, coins')
        .eq('user_id', userId)
        .single();

    if (error || !user) {
        return interaction.reply('❌ Du bist noch nicht registriert.');
    }

    return interaction.reply(`💰 Dein Kontostand: ${user.coins} Coins.`);
}
