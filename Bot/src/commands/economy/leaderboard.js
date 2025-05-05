import { SlashCommandBuilder, MessageEmbed } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Zeigt das Leaderboard der höchsten Level in jedem Beruf an.');

export async function execute(interaction) {
  // Hole alle Jobs und die höchsten Level für jeden Job
  const { data: leaderboardData, error } = await supabase
    .from('user_jobs')
    .select('user_id, job_id, level')
    .order('level', { ascending: false });

  if (error) {
    return interaction.reply('Fehler beim Abrufen der Leaderboard-Daten.');
  }

  // Hole die Job-Namen für alle Benutzer (optional, wenn du die Berufsnamen anzeigen möchtest)
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select('id, name');

  if (jobError) {
    return interaction.reply('Fehler beim Abrufen der Job-Daten.');
  }

  // Erstelle eine Map für die Jobnamen
  const jobMap = jobData.reduce((map, job) => {
    map[job.id] = job.name;
    return map;
  }, {});

  // Erstelle eine Embed-Nachricht für das Leaderboard
  const embed = new MessageEmbed()
    .setTitle('Leaderboard: Höchstes Level in jedem Beruf')
    .setDescription('Hier siehst du die höchsten Level in jedem Beruf.')
    .setColor('#00ff00')
    .setTimestamp();

  // Füge die Top 10 Benutzer für jedes Joblevel hinzu
  let leaderboardText = '';
  for (let i = 0; i < leaderboardData.length; i++) {
    const user = leaderboardData[i];
    const jobName = jobMap[user.job_id];

    leaderboardText += `**${i + 1}.** <@${user.user_id}> - **${jobName}** - Level: **${user.level}**\n`;
  }

  embed.addField('Top-Level-Berufe:', leaderboardText || 'Es gibt noch keine Benutzer im Leaderboard.');

  await interaction.reply({ embeds: [embed] });
}