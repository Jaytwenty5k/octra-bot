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
    
    // Festlegen des Preises basierend auf dem Gebäude
    const price = building === 'windmill' ? 500 * amount : 800 * amount; // Beispielpreise
    
    // Überprüfen, ob der Benutzer genug Geld hat
    if (wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Geld, um das zu kaufen!', ephemeral: true });
    }
    
    // Hole die aktuellen Gebäudebestände des Benutzers
    const { data: userBuildings, error: buildingError } = await supabase
      .from('user_buildings')
      .select('windmills, solar_panels')
      .eq('discord_id', userId)
      .single();
    
    if (buildingError) {
      return interaction.reply({ content: 'Fehler beim Abrufen deiner Gebäudeinformationen.', ephemeral: true });
    }
    
    // Berechne die neue Anzahl der Gebäude
    let updatedWindmills = userBuildings.windmills || 0;
    let updatedSolarPanels = userBuildings.solar_panels || 0;
    
    if (building === 'windmill') {
      updatedWindmills += amount;
    } else if (building === 'solar_panel') {
      updatedSolarPanels += amount;
    }
    
    // Aktualisiere die Gebäude in der Datenbank
    const { error: updateBuildingsError } = await supabase
      .from('user_buildings')
      .upsert({
        discord_id: userId,
        windmills: updatedWindmills,
        solar_panels: updatedSolarPanels,
      });
    
    if (updateBuildingsError) {
      return interaction.reply({ content: 'Fehler beim Hinzufügen des Gebäudes.', ephemeral: true });
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
    
    // Erfolgreiche Rückmeldung
    const buildingName = building === 'windmill' ? 'Windrad' : 'Solaranlage';
    await interaction.reply({ content: `Du hast erfolgreich ${amount} ${buildingName}(n) gekauft!`, ephemeral: false });
  },
};