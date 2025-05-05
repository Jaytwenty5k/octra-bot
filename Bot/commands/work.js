import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Arbeite und verdiene Einkommen + XP'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Hole Benutzer-Daten (Job)
    const { data: userJob, error: jobError } = await supabase
      .from('users')
      .select('job_id')
      .eq('discord_id', userId)
      .single();

    if (jobError || !userJob) {
      return interaction.reply({ content: 'Du hast noch keinen Job! Nutze /setjob, um einen Job auszuwählen.', ephemeral: true });
    }

    // Hole Job-Daten
    const { data: jobData, error: jobDataError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', userJob.job_id)
      .single();

    if (jobDataError || !jobData) {
      return interaction.reply({ content: 'Fehler beim Abrufen deines Jobs.', ephemeral: true });
    }

    // Berechne Einkommen (Einkommens-Multiplikator)
    const baseIncome = jobData.base_income;
    const multiplier = jobData.income_multiplier;
    const income = Math.floor(baseIncome * multiplier);

    // Job-XP erhöhen
    let newXP = jobData.job_xp + 20; // Beispiel: XP pro Arbeitseinheit
    let newLevel = jobData.job_level;
    let newXPToLevel = jobData.xp_to_level;

    if (newXP >= newXPToLevel) {
      newXP -= newXPToLevel;
      newLevel += 1;
      newXPToLevel = Math.floor(newXPToLevel * 1.2); // Schwierigkeit erhöht sich je Level
    }

    // Update Job-Daten in der Datenbank
    await supabase
      .from('jobs')
      .update({
        job_xp: newXP,
        job_level: newLevel,
        xp_to_level: newXPToLevel
      })
      .eq('id', userJob.job_id);

    // Antwort an den Benutzer
    interaction.reply(`Du hast gearbeitet und ${income}€ verdient! Dein Job-Level ist jetzt ${newLevel}.`);
  },
};