import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  EmbedBuilder,
} = pkg;
import { supabase } from '../../utils/supabaseClient.js'; // Pfad ggf. anpassen

const command = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Zeigt deinen aktuellen Kontostand an.'),
  async execute(interaction) {
    const discordId = interaction.user.id;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', discordId)
      .single();
    let userId;

    if (userError) {
      return interaction.reply('Fehler beim Abrufen der Benutzerdaten.');
    }
    if (!userData) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          discord_id: discordId,
          username: interaction.user.username,
          avatar_url: interaction.user.displayAvatarURL(),
        })
        .select('id')
        .single();
      if (insertError) {
        return interaction.reply('Fehler beim Registrieren.');
      }
      userId = newUser.id;

      const { error: walletError } = await supabase.from('wallets').insert({
        user_id: userId,
        currency: '€',
        balance: 0,
      });
      if (walletError) {
        return interaction.reply('Fehler beim Erstellen des Wallets.');
      }
    } else {
      userId = userData.id;
    }

    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('balance, currency')
      .eq('user_id', userId)
      .single();
    if (walletError || !walletData) {
      return interaction.reply('Kein Wallet gefunden.');
    }

    const { balance, currency } = walletData;
    await interaction.reply(`Dein Kontostand: **${balance} ${currency}**`);
  },
};

export default command;