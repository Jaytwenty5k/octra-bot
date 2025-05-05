import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../supabase.js';

export default {
  data: new SlashCommandBuilder()
      .setName('register')
          .setDescription('Registriert dich im System'),

            async execute(interaction) {
                const user = interaction.user;

                    // Prüfen, ob User schon existiert
                        const { data: existingUser } = await supabase
                              .from('users')
                                    .select('id')
                                          .eq('discord_id', user.id)
                                                .single();

                                                    if (existingUser) {
                                                          return interaction.reply({ content: 'Du bist bereits registriert!', ephemeral: true });
                                                              }

                                                                  // User hinzufügen
                                                                      const { error: insertError } = await supabase.from('users').insert({
                                                                            discord_id: user.id,
                                                                                  username: user.username,
                                                                                        avatar_url: user.displayAvatarURL(),
                                                                                            });

                                                                                                if (insertError) {
                                                                                                      console.error(insertError);
                                                                                                            return interaction.reply({ content: 'Fehler bei der Registrierung.', ephemeral: true });
                                                                                                                }

                                                                                                                    return interaction.reply({ content: 'Du bist nun registriert!', ephemeral: true });
                                                                                                                      },
                                                                                                                      };