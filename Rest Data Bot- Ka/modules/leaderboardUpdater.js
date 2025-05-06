import { supabase } from '../supabase.js';
import { EmbedBuilder } from 'discord.js';

export async function updateLeaderboard(channel) {
  const { data: jobs, error } = await supabase
      .from('jobs')
          .select('discord_id, job_id, job_level, job_xp')
              .order('job_level', { ascending: false });

                if (error || !jobs) return console.error('Fehler beim Abrufen der Jobdaten:', error);

                  // Gruppieren nach Job
                    const topByJob = {};
                      for (const entry of jobs) {
                          if (!topByJob[entry.job_id]) topByJob[entry.job_id] = [];
                              topByJob[entry.job_id].push(entry);
                                }

                                  const embed = new EmbedBuilder()
                                      .setTitle('**Top-Arbeiter pro Beruf**')
                                          .setColor('Green')
                                              .setTimestamp();

                                                for (const job in topByJob) {
                                                    const topUser = topByJob[job][0];
                                                        embed.addFields({
                                                              name: `${job.toUpperCase()}`,
                                                                    value: `<@${topUser.discord_id}> – Level: **${topUser.job_level}**, XP: ${topUser.job_xp}`,
                                                                          inline: false
                                                                              });
                                                                                }

                                                                                  // Alte Leaderboard-Nachricht löschen oder ersetzen?
                                                                                    await channel.bulkDelete(1).catch(() => {});
                                                                                      await channel.send({ embeds: [embed] });
                                                                                      }