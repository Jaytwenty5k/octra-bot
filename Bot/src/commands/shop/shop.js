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
    .setName('shop')
    .setDescription('Zeigt den Shop zum Kaufen von Windrädern und Solaranlagen!'),

  async execute(interaction) {
    // Embedded-Nachricht erstellen
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('💰 Willkommen im Shop! 💰')
      .setDescription('Wähle eine der Optionen unten, um Windräder oder Solaranlagen zu kaufen.')
      .addFields(
        { name: 'Windrad', value: 'Preis: 500 Coins\nGibt Einkommen alle 6 Stunden: 100 Coins', inline: true },
        { name: 'Solaranlage', value: 'Preis: 800 Coins\nGibt Einkommen alle 6 Stunden: 150 Coins', inline: true }
      )
      .setFooter({ text: 'Viel Spaß beim Shoppen!' })
      .setTimestamp();

    // Buttons für Auswahl
    const row = new ActionRowBuilder().addComponents(
      new MessageButton()
        .setCustomId('buy_windmill')
        .setLabel('Windrad kaufen')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('buy_solar_panel')
        .setLabel('Solaranlage kaufen')
        .setStyle('PRIMARY')
    );

    // Antwort mit Embed und Buttons
    await interaction.reply({ embeds: [embed], components: [row] });
  },

  // Handling der Button-Interaktionen
  async handleButtonInteraction(interaction) {
    const userId = interaction.user.id;
    const customId = interaction.customId;

    // Überprüfen des Kontostands des Benutzers
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();
    if (error || !wallet) {
      return interaction.reply({ content: 'Fehler beim Abrufen deines Kontostands.', ephemeral: true });
    }

    let price, building;
    if (customId === 'buy_windmill') {
      price = 500;
      building = 'Windrad';
    } else if (customId === 'buy_solar_panel') {
      price = 800;
      building = 'Solaranlage';
    }

    if (wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Coins, um dieses Gebäude zu kaufen!', ephemeral: true });
    }

    // Kaufe das Gebäude und füge es dem Benutzer hinzu
    const { error: updateError } = await supabase
      .from('user_buildings')
      .upsert({
        discord_id: userId,
        [building === 'Windrad' ? 'windmills' : 'solar_panels']: (building === 'Windrad' ? 1 : 0) + (building === 'Solaranlage' ? 1 : 0)
      });
    if (updateError) {
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

    await interaction.reply({ content: `Du hast erfolgreich 1 ${building} gekauft!`, ephemeral: true });
  }
};