import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
} = pkg;
import { supabase } from '../../utils/supabaseClient.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Fordere das Einkommen deiner Windräder oder Solaranlagen ab.'),
  async execute(interaction) {
    const discordId = interaction.user.id;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('discord_id', discordId)
      .single();

    if (userError || !userData) {
      return interaction.reply('Du bist nicht registriert. Bitte registriere dich zuerst.');
    }

    const userId = userData.id;

    const { data: assetsData, error: assetsError } = await supabase
      .from('assets')
      .select('id, type, last_claim, income')
      .eq('user_id', userId);

    if (assetsError || !assetsData || assetsData.length === 0) {
      return interaction.reply('Du hast keine Assets zum Abholen von Einkommen.');
    }

    let totalIncome = 0;
    const now = new Date();

    for (const asset of assetsData) {
      const lastClaim = new Date(asset.last_claim);
      const diff = now - lastClaim;

      if (diff >= 6 * 60 * 60 * 1000) {
        totalIncome += asset.income;

        const { error: updateError } = await supabase
          .from('assets')
          .update({ last_claim: now.toISOString() })
          .eq('id', asset.id);

        if (updateError) {
          return interaction.reply('Fehler beim Aktualisieren des Claim-Datums.');
        }
      }
    }

    if (totalIncome === 0) {
      return interaction.reply('Es gibt kein Einkommen zu beanspruchen. Vielleicht hast du gerade erst abgerufen.');
    }

    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (walletError || !walletData) {
      return interaction.reply('Fehler beim Abrufen deines Wallets. Bitte versuche es später.');
    }

    const newBalance = walletData.balance + totalIncome;

    const { error: updateWalletError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', userId);

    if (updateWalletError) {
      return interaction.reply('Fehler beim Hinzufügen des Einkommens zu deinem Wallet.');
    }

    await interaction.reply(`Du hast **${totalIncome} €** aus deinen Assets erhalten. Dein neuer Kontostand ist **${newBalance} €**.`);
  }
};

export default command;