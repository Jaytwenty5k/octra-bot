import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { supabase } from '../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('coins')
  .setDescription('Zeigt deine aktuellen Coins.');

export async function execute(interaction) {
  const userId = interaction.user.id;

  // Chips aus der Datenbank abrufen oder Standardwert setzen
  const { data: userData, error } = await supabase
    .from('casino')
    .select('chips')
    .eq('user_id', userId)
    .single();

  let chips = userData?.chips || 0;

  if (error) {
    console.error('Fehler beim Abrufen der Chips:', error.message);
    await interaction.reply({ content: 'Fehler beim Laden deiner Chips.', ephemeral: true });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(`💰 Deine Chips`)
    .setDescription(`Du hast aktuell **${chips}** Chips.`)
    .setColor('#FFD700')
    .setFooter({ text: 'Kaufe oder verkaufe Chips mit den Buttons unten.' });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('buy_chips')
        .setLabel('Chips kaufen')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('sell_chips')
        .setLabel('Chips verkaufen')
        .setStyle(ButtonStyle.Danger)
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}
