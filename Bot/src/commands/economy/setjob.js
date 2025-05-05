import { SlashCommandBuilder, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('setjob')
  .setDescription('Setze deinen Job.')
  .addStringOption(option =>
    option.setName('job')
      .setDescription('Der Job, den du übernehmen möchtest.')
      .setRequired(true)
      .addChoices(
        { name: 'Bauer', value: 'farmer' },
        { name: 'Bauarbeiter', value: 'builder' }
        // Weitere Jobs hier hinzufügen
      ));

export async function execute(interaction) {
  const discordId = interaction.user.id;
  const jobName = interaction.options.getString('job');

  // Hole User-Daten
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('discord_id', discordId)
    .single();

  if (userError || !userData) {
    return interaction.reply('Du bist nicht registriert.');
  }

  const userId = userData.id;

  // Hole die aktuellen Job-Daten des Benutzers
  const { data: userJobData, error: jobError } = await supabase
    .from('user_jobs')
    .select('job_id')
    .eq('user_id', userId)
    .single();

  if (jobError) {
    return interaction.reply('Fehler beim Abrufen deines Jobs.');
  }

  const currentJobId = userJobData ? userJobData.job_id : null;

  // Hole Job-Daten
  const { data: jobData, error: jobDetailsError } = await supabase
    .from('jobs')
    .select('id, name, max_level, description, expected_income')
    .eq('name', jobName)
    .single();

  if (jobDetailsError || !jobData) {
    return interaction.reply('Job nicht gefunden.');
  }

  const { id: jobId, name: jobTitle, expected_income } = jobData;

  // Erstelle die Embed-Nachricht für die Job-Auswahl
  const embed = new MessageEmbed()
    .setTitle(`Bist du sicher, dass du den Job wechseln möchtest?`)
    .setDescription(`Du möchtest **${jobTitle}** übernehmen.`)
    .addFields(
      { name: 'Aktueller Job', value: currentJobId ? `**${currentJobId}**` : 'Kein Job ausgewählt', inline: true },
      { name: 'Neuer Job', value: `**${jobTitle}**`, inline: true },
      { name: 'Erwartetes Einkommen', value: `**${expected_income}** pro Stunde`, inline: false }
    )
    .setColor('#00ff00')
    .setTimestamp();

  // Erstelle Buttons für die Bestätigung
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('confirm')
        .setLabel('Job Wechseln')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId('cancel')
        .setLabel('Abbrechen')
        .setStyle('DANGER')
    );

  // Sende die Embed-Nachricht mit den Buttons
  await interaction.reply({
    embeds: [embed],
    components: [row]
  });

  // Warten auf die Antwort des Benutzers
  const filter = (buttonInteraction) => buttonInteraction.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId === 'confirm') {
      // Setze den Job des Benutzers
      const { data: userJobUpdate, error: jobUpdateError } = await supabase
        .from('user_jobs')
        .upsert({
          user_id: userId,
          job_id: jobId,
          level: 1, // Level 1 als Standard
          xp: 0,   // XP zu Beginn
        });

      if (jobUpdateError) {
        return buttonInteraction.reply('Fehler beim Wechseln deines Jobs.');
      }

      await buttonInteraction.update({
        content: `Du hast jetzt den Job **${jobTitle}** übernommen!`,
        components: [],
      });
    } else if (buttonInteraction.customId === 'cancel') {
      // Jobwechsel abgebrochen
      await buttonInteraction.update({
        content: 'Jobwechsel abgebrochen.',
        components: [],
      });
    }
  });

  collector.on('end', async (collected, reason) => {
    if (reason === 'time') {
      await interaction.editReply({
        content: 'Die Zeit ist abgelaufen! Bitte versuche es erneut.',
        components: [],
      });
    }
  });
}