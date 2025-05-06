import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  MessageEmbed,
  MessageButton,
  ActionRowBuilder,
  EmbedBuilder // Falls du Buttons verwendest
} = pkg;
import { supabase } from '../../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Kaufe und aktiviere ein Haustier für deinen Account!')
    .addStringOption(option =>
      option.setName('pet_type')
        .setDescription('Wähle das Haustier, das du kaufen möchtest')
        .setRequired(true)
        .addChoices(
          { name: 'Hund', value: 'hund' },
          { name: 'Katze', value: 'katze' }
        )),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const petType = interaction.options.getString('pet_type');
    const incomeBonus = petType === 'hund' ? 50 : 30; // Einkommensbonus je nach Haustier
    const price = petType === 'hund' ? 300 : 200; // Preis für das Haustier

    // Überprüfen, ob der Benutzer bereits ein Haustier hat
    const { data: existingPet, error: existingPetError } = await supabase
      .from('pets')
      .select('id')
      .eq('discord_id', userId)
      .eq('active', true)
      .single();
    if (existingPet && !existingPetError) {
      return interaction.reply({ content: 'Du hast bereits ein aktives Haustier. Möchtest du es deaktivieren und ein anderes kaufen?', ephemeral: true });
    }

    // Überprüfen, ob der Benutzer genug Coins hat
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();
    if (walletError || wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Coins, um dieses Haustier zu kaufen.', ephemeral: true });
    }

    // Start einer Transaktion
    const { error: transactionError } = await supabase
      .rpc('start_transaction');
    if (transactionError) {
      return interaction.reply({ content: 'Fehler beim Starten der Transaktion.', ephemeral: true });
    }

    // Haustier kaufen und in der Datenbank speichern
    const { error: insertError } = await supabase
      .from('pets')
      .insert([
        {
          discord_id: userId,
          pet_type: petType,
          income_bonus: incomeBonus,
          active: true,
        },
      ]);
    if (insertError) {
      return interaction.reply({ content: 'Fehler beim Hinzufügen des Haustiers.', ephemeral: true });
    }

    // Kontostand aktualisieren
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - price,
      })
      .eq('discord_id', userId);
    if (updateError) {
      return interaction.reply({ content: 'Fehler beim Abziehen der Coins.', ephemeral: true });
    }

    // Transaktion abschließen
    const { error: commitError } = await supabase
      .rpc('commit_transaction');
    if (commitError) {
      return interaction.reply({ content: 'Fehler beim Abschließen der Transaktion.', ephemeral: true });
    }

    // Erfolgsmeldung
    await interaction.reply({ content: `Du hast erfolgreich ein Haustier (🐶 ${petType === 'hund' ? 'Hund' : 'Katze'}) gekauft und aktiviert! Dein Einkommensbonus beträgt ${incomeBonus} Coins.`, ephemeral: true });
  },
};