// src/events/interactionCreate.js
import { handleJobSelection } from '../modules/jobHandler.js';
import { supabase } from '../../utils/supabaseClient.js';

export default {
  name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
              const command = client.commands.get(interaction.commandName);
                    if (!command) return;
                          try {
                                  await command.execute(interaction, client);
                                        } catch (error) {
                                                console.error(error);
                                                        await interaction.reply({ content: 'Fehler bei der Ausführung.', ephemeral: true });
                                                              }
                                                                  }

                                                                      // Jobauswahl per Dropdown
                                                                          if (interaction.isStringSelectMenu() && interaction.customId === 'job_selection') {
                                                                                return handleJobSelection(interaction);
                                                                                    }

                                                                                        // Buttons wie Job bestätigen/abbrechen
                                                                                            if (interaction.isButton()) {
                                                                                                  if (interaction.customId.startsWith('confirm_job_')) {
                                                                                                          const jobId = interaction.customId.replace('confirm_job_', '');

                                                                                                                  await supabase
                                                                                                                            .from('jobs')
                                                                                                                                      .upsert({
                                                                                                                                                  discord_id: interaction.user.id,
                                                                                                                                                              job_id: jobId,
                                                                                                                                                                          job_xp: 0,
                                                                                                                                                                                      job_level: 1
                                                                                                                                                                                                });

                                                                                                                                                                                                        return interaction.update({
                                                                                                                                                                                                                  content: `Du wurdest als **${jobId}** eingetragen.`,
                                                                                                                                                                                                                            embeds: [],
                                                                                                                                                                                                                                      components: []
                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                          if (interaction.customId === 'cancel_job') {
                                                                                                                                                                                                                                                                  return interaction.update({
                                                                                                                                                                                                                                                                            content: 'Jobwechsel abgebrochen.',
                                                                                                                                                                                                                                                                                      embeds: [],
                                                                                                                                                                                                                                                                                                components: []
                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                    };