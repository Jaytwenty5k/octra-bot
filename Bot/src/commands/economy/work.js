import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../supabase/supabase.js';

export const data = new SlashCommandBuilder()
  .setName('work')
  .setDescription('Arbeite und verdiene Geld sowie XP!');

export async function execute(interaction) {
  const discordId = interaction.user.id;
  
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

  // Hole Job-Details
  const { data: userJobData, error: jobError } = await supabase
    .from('user_jobs')
    .select('job_id, level, xp')
    .eq('user_id', userId)
    .single();

  if (jobError || !userJobData) {
    return interaction.reply('Du hast keinen Job. Setze deinen Job mit `/setjob`.');
  }

  const { job_id, level, xp } = userJobData;

  // Hole Job-Details
  const { data: jobData, error: jobDetailsError } = await supabase
    .from('jobs')
    .select('name, max_level')
    .eq('id', job_id)
    .single();

  if (jobDetailsError || !jobData) {
    return interaction.reply('Job nicht gefunden.');
  }

  const { name: jobName, max_level } = jobData;

  // XP verdienen und Level-Up prüfen
  const earnedXP = Math.floor(Math.random() * 100) + 50;  // Zufällig zwischen 50 und 150 XP
  const newXP = xp + earnedXP;
  let newLevel = level;

  if (newXP >= 100 * newLevel) {
    newLevel = Math.min(newLevel + 1, max_level);
  }

  // Job-Daten aktualisieren
  await supabase
    .from('user_jobs')
    .update({
      xp: newXP,
      level: newLevel,
    })
    .eq('user_id', userId);

  await interaction.reply(`Du hast **${earnedXP} XP** verdient! Dein Job-Level ist jetzt **${newLevel}**.`);
}