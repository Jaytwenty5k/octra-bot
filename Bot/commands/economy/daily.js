import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('daily')
  .setDescription('Erhalte deine tägliche Belohnung!');

export async function execute(interaction) {
  const discordId = interaction.user.id;
  const dailyAmount = 500;

  // Hole User + Wallet
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('discord_id', discordId)
    .single();

  if (userError || !userData) {
    return interaction.reply('Du bist nicht registriert.');
  }

  const userId = userData.id;

  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('balance, last_daily')
    .eq('user_id', userId)
    .single();

  if (walletError || !walletData) {
    return interaction.reply('Wallet nicht gefunden.');
  }

  const now = new Date();
  const lastDaily = new Date(walletData.last_daily);
  const diff = now - lastDaily;

  if (!isNaN(diff) && diff < 86400000) {
    const remaining = 86400000 - diff;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    return interaction.reply(`Komm in **${hours}h ${minutes}min** wieder für deine nächste Belohnung.`);
  }

  // Update Balance + Zeit
  await supabase
    .from('wallets')
    .update({
      balance: walletData.balance + dailyAmount,
      last_daily: now.toISOString(),
    })
    .eq('user_id', userId);

  // Optional: Transaktion loggen
  await supabase.from('transactions').insert({
    user_id: userId,
    type: 'daily',
    amount: dailyAmount,
    description: 'Tägliche Belohnung',
  });

  await interaction.reply(`Du hast **${dailyAmount} €** erhalten!`);
}