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

// Blackjack Spielstart
export async function startBlackjack(interaction) {
  const embed = new EmbedBuilder()
    .setTitle('🃏 Blackjack - Einsatz')
    .setDescription('Wie viele Chips möchtest du setzen?')
    .setColor('#228B22');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('bet_10')
        .setLabel('10 Chips')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('bet_25')
        .setLabel('25 Chips')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('bet_50')
        .setLabel('50 Chips')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('bet_75')
        .setLabel('75 Chips')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('bet_100')
        .setLabel('100 Chips')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('bet_125')
        .setLabel('125 Chips')
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId('bet_150')
        .setLabel('150 Chips')
        .setStyle(ButtonStyle.Primary)
    );

  await interaction.reply({ embeds: [embed], components: [row] });
}
