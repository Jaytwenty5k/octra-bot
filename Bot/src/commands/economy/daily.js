import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
} = pkg;
import { supabase } from '../../utils/supabaseClient.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Erhalte deine tägliche Belohnung!'),
  async execute(interaction) {
    const discordId = interaction.user.id;
    const dailyAmount = 500;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', discordId)
      .single();

    if (userError || !userData) {
      return interaction.reply('Du bist nicht registriert. Bitte registriere dich zuerst.');
    }

    const userId = userData.id;

    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('balance, last_daily')
      .eq('user_id', userId)
      .single();

    if (walletError || !walletData) {
      return interaction.reply('Dein Wallet konnte nicht gefunden werden. Bitte versuche es später.');
    }

    const now = new Date();
    const lastDaily = new Date(walletData.last_daily);
    const diff = now - lastDaily;

    if (!isNaN(diff) && diff < 86400000) {
      const remaining = 86400000 - diff;
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      return interaction.reply(`Komm in **${hours}h ${minutes}min** wieder für deine nächste tägliche Belohnung.`);
    }

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: walletData.balance + dailyAmount,
        last_daily: now.toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      return interaction.reply('Fehler beim Aktualisieren deines Wallets. Bitte versuche es später.');
    }

    const { error: transactionError } = await supabase.from('transactions').insert({
      user_id: userId,
      type: 'daily',
      amount: dailyAmount,
      description: 'Tägliche Belohnung',
    });

    if (transactionError) {
      return interaction.reply('Fehler beim Loggen der Transaktion. Deine Belohnung wurde jedoch hinzugefügt.');
    }

    await interaction.reply(`Du hast **${dailyAmount} €** erhalten! Dein neuer Kontostand ist **${walletData.balance + dailyAmount} €**.`);
  }
};

export default command;