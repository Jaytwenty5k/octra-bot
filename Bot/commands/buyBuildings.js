import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('buy_building')
    .setDescription('Kaufe Windräder oder Solaranlagen!')
    .addStringOption(option =>
      option.setName('building')
        .setDescription('Wähle das Gebäude, das du kaufen möchtest.')
        .setRequired(true)
        .addChoices(
          { name: 'Windrad', value: 'windmill' },
          { name: 'Solaranlage', value: 'solar_panel' }
        ))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Wieviele Gebäude möchtest du kaufen?')
        .setRequired(true)
        .setMinValue(1)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const building = interaction.options.getString('building');
    const amount = interaction.options.getInteger('amount');

    // Überprüfen des Kontostands des Benutzers
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();

    if (error || !wallet) {
      return interaction.reply({ content: 'Fehler beim Abrufen deines Kontostands.', ephemeral: true });
    }

    const price = building === 'windmill' ? 500 * amount : 800 * amount; // Beispielpreise
    if (wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Geld, um das zu kaufen!', ephemeral: true });
    }

    // Kaufe das Gebäude und füge es dem Benutzer hinzu
    const { error: updateError } = await supabase
      .from('user_buildings')
      .upsert({
        discord_id: userId,
        [building === 'windmill' ? 'windmills' : 'solar_panels']: (amount) + (building === 'windmill' ? 0 : 0)
      });

    if (updateError) {
      return interaction.reply({ content: 'Fehler beim Kaufen des Gebäudes.', ephemeral: true });
    }

    // Reduziere den Kontostand
    const { error: balanceError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - price
      })
      .eq('discord_id', userId);

    if (balanceError) {
      return interaction.reply({ content: 'Fehler beim Abziehen des Geldes.', ephemeral: true });
    }

    interaction.reply({ content: `Du hast erfolgreich ${amount} ${building === 'windmill' ? 'Windrad' : 'Solaranlage'}(n) gekauft!` });
  },
};