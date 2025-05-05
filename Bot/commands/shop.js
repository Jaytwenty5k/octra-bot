import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';
import { EmbedBuilder } from 'discord.js';

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
    const row = {
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: 'Windrad kaufen',
          custom_id: 'buy_windmill',
        },
        {
          type: 2,
          style: 1,
          label: 'Solaranlage kaufen',
          custom_id: 'buy_solar_panel',
        },
      ],
    };

    // Antwort mit Embed und Buttons
    await interaction.reply({ embeds: [embed], components: [row] });
  },
};