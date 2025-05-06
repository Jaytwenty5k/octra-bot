import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  EmbedBuilder,
} = pkg;
import { supabase } from '../../supabase/supabase.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Zeigt das Leaderboard der höchsten Level in jedem Beruf an.'),
    
  async execute(interaction) {
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('user_jobs')
      .select('user_id, job_id, level')
      .order('level', { ascending: false });

    if (leaderboardError) {
      return interaction.reply('Fehler beim Abrufen der Leaderboard-Daten.');
    }

    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select('id, name');

    if (jobError) {
      return interaction.reply('Fehler beim Abrufen der Job-Daten.');
    }

    const jobMap = jobData.reduce((map, job) => {
      map[job.id] = job.name;
      return map;
    }, {});

    const embed = new EmbedBuilder()
      .setTitle('Leaderboard: Höchstes Level in jedem Beruf')
      .setDescription('Hier siehst du die höchsten Level in jedem Beruf.')
      .setColor('#00ff00')
      .setTimestamp();

    let leaderboardText = '';
    let count = 0;

    for (let i = 0; i < leaderboardData.length && count < 10; i++) {
      const user = leaderboardData[i];
      const jobName = jobMap[user.job_id] || 'Unbekannt';
      leaderboardText += `**${i + 1}.** <@${user.user_id}> - **${jobName}** - Level: **${user.level}**\n`;
      count++;
    }

    embed.addFields({
      name: 'Top-Level-Berufe:',
      value: leaderboardText || 'Es gibt noch keine Benutzer im Leaderboard.',
    });

    await interaction.reply({ embeds: [embed] });
  }
};

export default command;