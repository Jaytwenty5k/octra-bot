// src/events/ready.js
import { updateLeaderboard } from '../modules/leaderboardUpdater.js';

export default {
  name: 'ready',
    once: true,
      async execute(client) {
          console.log(`Bot ist online als ${client.user.tag}`);

              const leaderboardChannel = await client.channels.fetch(process.env.LEADERBOARD_CHANNEL);
                  if (!leaderboardChannel) return console.warn('Leaderboard-Channel nicht gefunden.');

                      // Initiales Update
                          await updateLeaderboard(leaderboardChannel);

                              // Alle 10 Minuten aktualisieren
                                  setInterval(async () => {
                                        await updateLeaderboard(leaderboardChannel);
                                            }, 10 * 60 * 1000);
                                              }
                                              };