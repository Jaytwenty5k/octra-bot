import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('claim')
  .setDescription('Fordere das Einkommen deiner Windräder oder Solaranlagen ab.');

export async function execute(interaction) {
  const discordId = interaction.user.id;

  // Hole User-Daten
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('discord_id', discordId)
    .single();

  if (userError || !userData) {
    return interaction.reply('Du bist nicht registriert.');
  }

  const userId = userData.id;

  // Hole Asset-Daten (Windräder, Solaranlagen)
  const { data: assetsData, error: assetsError } = await supabase
    .from('assets')
    .select('id, type, last_claim, income')
    .eq('user_id', userId);

  if (assetsError || !assetsData) {
    return interaction.reply('Du hast keine Assets.');
  }

  let totalIncome = 0;
  const now = new Date();

  // Berechne, wie viel Einkommen der User bekommt
  for (const asset of assetsData) {
    const lastClaim = new Date(asset.last_claim);
    const diff = now - lastClaim;

    if (diff >= 6 * 60 * 60 * 1000) {  // 6 Stunden
      totalIncome += asset.income;

      // Aktualisiere das letzte Claim-Datum
      await supabase
        .from('assets')
        .update({ last_claim: now.toISOString() })
        .eq('id', asset.id);
    }
  }

  if (totalIncome === 0) {
    return interaction.reply('Es gibt kein Einkommen zu beanspruchen.');
  }

  // Füge das Einkommen zum Wallet des Benutzers hinzu
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (walletError || !walletData) {
    return interaction.reply('Fehler beim Abrufen des Wallets.');
  }

  const newBalance = walletData.balance + totalIncome;

  // Aktualisiere das Wallet
  await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId);

  await interaction.reply(`Du hast **${totalIncome} €** aus deinen Assets erhalten.`);
}