import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('casino')
  .setDescription('Öffnet den Casino-Hub.');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🎰 Casino Hub')
    .setDescription('Willkommen im Casino! Wähle ein Spiel oder eine Aktion aus:')
    .setColor('#FFD700')
    .addFields(
      { name: '🃏 Kartenspiele', value: 'Erlebe spannende Kartenspiele!' },
      { name: '🎲 Würfelspiele', value: 'Teste dein Glück mit Würfeln!' },
      { name: '💰 Jackpot', value: 'Versuche dein Glück beim Jackpot!' }
    )
    .setFooter({ text: 'Viel Glück im Casino!' });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('cards')
        .setLabel('Kartenspiele')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('dice')
        .setLabel('Würfelspiele')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('jackpot')
        .setLabel('Jackpot')
        .setStyle(ButtonStyle.Success)
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}
