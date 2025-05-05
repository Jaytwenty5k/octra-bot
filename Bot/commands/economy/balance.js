import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Zeigt deinen aktuellen Kontostand an.');

export async function execute(interaction) {
  const discordId = interaction.user.id;

  // Hole user_id aus users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('discord_id', discordId)
    .single();

    let userId;

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
    
      // Wallet anlegen
      await supabase.from('wallets').insert({
        user_id: userId,
        currency: '€',
        balance: 0,
      });
    } else {
      userId = userData.id; 
    }

  // Hole Wallet
  const { data: walletData, error: walletError } = await supabase
    .from('wallets')
    .select('balance, currency')
    .eq('user_id', userData.id)
    .single();

  if (walletError || !walletData) {
    return interaction.reply('Kein Wallet gefunden.');
  }

  const { balance, currency } = walletData;
  await interaction.reply(`Dein Kontostand: **${balance} ${currency}**`);
}