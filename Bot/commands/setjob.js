import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setjob')
    .setDescription('Wähle deinen Job aus.')
    .addStringOption(option =>
      option.setName('job')
        .setDescription('Wähle einen Job')
        .setRequired(true)
        .addChoices(
          { name: 'Bauer', value: 'bauer' },
          { name: 'Programmierer', value: 'programmierer' }
        )),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const job = interaction.options.getString('job');

    // Überprüfen, ob der Benutzer bereits einen Job hat
    const { data: existingJob, error: existingJobError } = await supabase
      .from('users')
      .select('job_id')
      .eq('discord_id', userId)
      .single();

    if (existingJob && !existingJobError) {
      return interaction.reply({ content: 'Du hast bereits einen Job. Möchtest du den Job wechseln?', ephemeral: true });
    }

    // Wenn der Benutzer noch keinen Job hat, setze den Job
    const { error } = await supabase
      .from('users')
      .upsert({
        discord_id: userId,
        job_id: job
      });

    if (error) {
      return interaction.reply({ content: 'Fehler beim Festlegen deines Jobs.', ephemeral: true });
    }

    interaction.reply({ content: `Dein Job wurde auf ${job} gesetzt!` });
  },
};