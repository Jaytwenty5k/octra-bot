import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('boost')
    .setDescription('Kaufe oder aktiviere einen Boost oder Pass für deinen Job!'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Überprüfen, ob der Benutzer bereits den erforderlichen Level oder Voice-Channel-Zeit hat
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('level, voice_hours')
      .eq('discord_id', userId)
      .single();

    if (userError || !user) {
      return interaction.reply({ content: 'Fehler beim Abrufen deiner Benutzerdaten.', ephemeral: true });
    }

    // Beispiel für einen Pass, der Level 10 benötigt
    const passLevelRequirement = 10;

    if (user.level < passLevelRequirement) {
      return interaction.reply({ content: `Du musst mindestens Level ${passLevelRequirement} erreichen, um diesen Boost zu erhalten.`, ephemeral: true });
    }

    // Boost/Passtyp (z. B. XP-Boost)
    const boostType = 'XP Boost';
    const boostDuration = 6; // Stunden
    const price = 500; // Preis für den Boost

    // Überprüfen, ob der Benutzer genug Coins hat
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();

    if (walletError || wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Coins, um diesen Boost zu kaufen.', ephemeral: true });
    }

    // Boost/Passt kaufen und in der Datenbank speichern
    const { error: insertError } = await supabase
      .from('passes')
      .insert([
        {
          discord_id: userId,
          boost_type: boostType,
          duration: boostDuration,
          active: true,
          level_requirement: passLevelRequirement,
          voice_hours: 0, // Beispiel: Keine Voice-Channel-Anforderung
        },
      ]);

    if (insertError) {
      return interaction.reply({ content: 'Fehler beim Hinzufügen des Boosts.', ephemeral: true });
    }

    // Benutzerkonto aktualisieren (Coins abziehen)
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - price,
      })
      .eq('discord_id', userId);

    if (updateError) {
      return interaction.reply({ content: 'Fehler beim Abziehen der Coins.', ephemeral: true });
    }

    // Erfolgsmeldung
    await interaction.reply({ content: 'Du hast erfolgreich einen XP-Boost gekauft und aktiviert!', ephemeral: true });
  },
};