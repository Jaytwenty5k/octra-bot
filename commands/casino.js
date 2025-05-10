import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../database/supabase.js'; // Verbindung zur Supabase

export const data = new SlashCommandBuilder()
    .setName('casino')
    .setDescription('Verwalte dein Casino und deine Chips.');

export async function execute(interaction) {
    const userId = interaction.user.id;

    // Prüfen, ob der Benutzer in der Datenbank Chips hat
    const { data, error } = await supabase
        .from('casino') // Tabelle 'casino' anpassen, falls anders benannt
        .select('chips')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return interaction.reply({
            content: 'Du hast noch keine Chips. Bitte registriere dich zuerst mit /register.',
            ephemeral: true,
        });
    }

    const chips = data.chips;
    return interaction.reply({
        content: `Du hast ${chips} Chips im Casino.`,
        ephemeral: true,
    });
}
