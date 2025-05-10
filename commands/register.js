import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../database/supabase.js'; // Verbindung zur Supabase

export const data = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registriere dich in der Datenbank.');

export async function execute(interaction) {
    const userId = interaction.user.id; // Discord User ID
    const username = interaction.user.username; // Discord Username

    // Prüfen, ob der Benutzer bereits registriert ist
    const { data, error } = await supabase
        .from('users')  // Tabelle 'users' anpassen, falls anders benannt
        .select('id')
        .eq('id', userId)
        .single();

    if (data) {
        return interaction.reply({
            content: `Du bist bereits registriert als ${username}.`,
            ephemeral: true,
        });
    }

    // Benutzer registrieren
    const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: userId, username: username }]);

    if (insertError) {
        return interaction.reply({
            content: `Fehler bei der Registrierung: ${insertError.message}`,
            ephemeral: true,
        });
    }

    return interaction.reply({
        content: `Willkommen, ${username}! Du wurdest erfolgreich registriert.`,
        ephemeral: true,
    });
}
