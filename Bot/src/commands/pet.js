import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Kaufe und aktiviere ein Haustier für deinen Account!'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Beispiel für Haustier - Hund, der einen Einkommensbonus von 50 Coins gibt
    const petType = 'Hund';
    const incomeBonus = 50; // Coins
    const price = 300; // Preis für das Haustier

    // Überprüfen, ob der Benutzer genug Coins hat
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();

    if (walletError || wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Coins, um dieses Haustier zu kaufen.', ephemeral: true });
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

    // Erfolgsmeldung
    await interaction.reply({ content: `Du hast erfolgreich ein Haustier (🐶 ${petType}) gekauft und aktiviert!`, ephemeral: true });
  },
};