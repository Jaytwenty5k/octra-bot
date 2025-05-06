import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  MessageEmbed,
  MessageButton,
  ActionRowBuilder,
  EmbedBuilder // Falls du Buttons verwendest
} = pkg;
import { supabase } from '../../supabase.js';

export default {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registriert dich im System'),
    
  async execute(interaction) {
    const user = interaction.user;
    
    // Prüfen, ob der User bereits existiert
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', user.id)
      .single();

    if (userError) {
      console.error(userError);
      return interaction.reply({ content: 'Fehler beim Überprüfen des Benutzers.', ephemeral: true });
    }

    if (existingUser) {
      return interaction.reply({ content: 'Du bist bereits registriert!', ephemeral: true });
    }

    // User in der Datenbank hinzufügen
    const { error: insertError } = await supabase.from('users').insert({
      discord_id: user.id,
      username: user.username,
      avatar_url: user.displayAvatarURL(),
    });

    if (insertError) {
      console.error(insertError);
      return interaction.reply({ content: 'Fehler bei der Registrierung.', ephemeral: true });
    }

    return interaction.reply({ content: 'Du bist nun registriert!', ephemeral: true });
  },
};