import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setjob')
    .setDescription('Wähle deinen Beruf aus!'),
    
  async execute(interaction) {
    const jobs = [
      { id: 'lieferfahrer', name: 'Lieferfahrer', einkommen: 50 },
      { id: 'verkäufer', name: 'Verkäufer', einkommen: 80 },
      { id: 'manager', name: 'Manager', einkommen: 120 }
    ];

    const options = jobs.map(job => ({
      label: job.name,
      description: `Einkommen: ${job.einkommen}€ pro 3h`,
      value: job.id
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('job_selection')
        .setPlaceholder('Wähle deinen Beruf')
        .addOptions(options)
    );

    const embed = new EmbedBuilder()
      .setTitle('Beruf auswählen')
      .setDescription('Wähle unten deinen gewünschten Beruf aus.');

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};