client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

      const userId = interaction.user.id;

        if (interaction.customId === 'buy_windmill' || interaction.customId === 'buy_solar_panel') {
            const buildingType = interaction.customId === 'buy_windmill' ? 'windmill' : 'solar_panel';
                const price = buildingType === 'windmill' ? 500 : 800; // Preise für Windräder und Solaranlagen
                    const amount = 1; // Hier kaufen wir nur 1 Gebäude pro Interaktion

                        // Überprüfen des Kontostands des Benutzers
                            const { data: wallet, error } = await supabase
                                  .from('wallets')
                                        .select('balance')
                                              .eq('discord_id', userId)
                                                    .single();

                                                        if (error || !wallet) {
                                                              return interaction.reply({ content: 'Fehler beim Abrufen deines Kontostands.', ephemeral: true });
                                                                  }

                                                                      if (wallet.balance < price) {
                                                                            return interaction.reply({ content: 'Du hast nicht genug Geld, um das zu kaufen!', ephemeral: true });
                                                                                }

                                                                                    // Kaufe das Gebäude und füge es dem Benutzer hinzu
                                                                                        const { error: updateError } = await supabase
                                                                                              .from('user_buildings')
                                                                                                    .upsert({
                                                                                                            discord_id: userId,
                                                                                                                    [buildingType === 'windmill' ? 'windmills' : 'solar_panels']: (amount) + (buildingType === 'windmill' ? 0 : 0)
                                                                                                                          });

                                                                                                                              if (updateError) {
                                                                                                                                    return interaction.reply({ content: 'Fehler beim Kaufen des Gebäudes.', ephemeral: true });
                                                                                                                                        }

                                                                                                                                            // Reduziere den Kontostand
                                                                                                                                                const { error: balanceError } = await supabase
                                                                                                                                                      .from('wallets')
                                                                                                                                                            .update({
                                                                                                                                                                    balance: wallet.balance - price
                                                                                                                                                                          })
                                                                                                                                                                                .eq('discord_id', userId);

                                                                                                                                                                                    if (balanceError) {
                                                                                                                                                                                          return interaction.reply({ content: 'Fehler beim Abziehen des Geldes.', ephemeral: true });
                                                                                                                                                                                              }

                                                                                                                                                                                                  // Bestätigung
                                                                                                                                                                                                      await interaction.update({ content: `Du hast erfolgreich ein ${buildingType === 'windmill' ? 'Windrad' : 'Solaranlage'} gekauft!`, components: [] });
                                                                                                                                                                                                        }
                                                                                                                                                                                                        });
1