import pkg from 'discord.js';
const {
  SlashCommandBuilder,
  MessageEmbed,
  MessageButton,
  ActionRowBuilder,
  EmbedBuilder // Falls du Buttons verwendest
} = pkg;
import { supabase } from '../../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('boost')
    .setDescription('Kaufe oder aktiviere einen Boost oder Pass für deinen Job!')
    .addStringOption(option =>
      option.setName('boost_type')
        .setDescription('Wähle den Boost-Typ')
        .setRequired(true)
        .addChoices(
          { name: 'XP Boost', value: 'xp_boost' },
          { name: 'Speed Boost', value: 'speed_boost' }
        )),
  
  async execute(interaction) {
    const userId = interaction.user.id;
    const boostType = interaction.options.getString('boost_type');
    
    // Überprüfen, ob der Benutzer bereits den erforderlichen Level erreicht hat
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('level, voice_hours')
      .eq('discord_id', userId)
      .single();
    if (userError || !user) {
      return interaction.reply({ content: 'Fehler beim Abrufen deiner Benutzerdaten. Versuche es später erneut.', ephemeral: true });
    }

    // Beispiel für einen Pass, der Level 10 benötigt (hier könnte man den Boost-Level dynamisch anpassen)
    const passLevelRequirement = 10;
    if (user.level < passLevelRequirement) {
      return interaction.reply({ content: `Du musst mindestens Level ${passLevelRequirement} erreichen, um diesen Boost zu erhalten.`, ephemeral: true });
    }

    // Boost-Daten (abhängig vom Boost-Typ)
    let boostDuration = 6; // Stunden
    let price = 500; // Standardpreis für den Boost
    let boostMessage = 'XP-Boost';
    
    if (boostType === 'speed_boost') {
      boostDuration = 12; // Beispiel für einen anderen Boost-Typ
      price = 800; // Höherer Preis für den Speed Boost
      boostMessage = 'Speed-Boost';
    }

    // Überprüfen, ob der Benutzer genug Coins hat
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', userId)
      .single();
    if (walletError || wallet.balance < price) {
      return interaction.reply({ content: 'Du hast nicht genug Coins, um diesen Boost zu kaufen.', ephemeral: true });
    }

    // Überprüfen, ob der Benutzer bereits einen aktiven Boost hat
    const { data: existingBoost, error: existingBoostError } = await supabase
      .from('passes')
      .select('active')
      .eq('discord_id', userId)
      .eq('active', true)
      .single();
    if (existingBoost && !existingBoostError) {
      return interaction.reply({ content: `Du hast bereits einen aktiven Boost. Möchtest du ihn verlängern?`, ephemeral: true });
    }

    // Boost/Passt kaufen und in der Datenbank speichern
    const { error: insertError } = await supabase
      .from('passes')
      .insert([
        {
          discord_id: userId,
          boost_type: boostMessage,
          duration: boostDuration,
          active: true,
          level_requirement: passLevelRequirement,
          voice_hours: 0, // Beispiel: Keine Voice-Channel-Anforderung
        },
      ]);
    if (insertError) {
      return interaction.reply({ content: 'Fehler beim Hinzufügen des Boosts. Versuche es später erneut.', ephemeral: true });
    }

    // Benutzerkonto aktualisieren (Coins abziehen)
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - price,
      })
      .eq('discord_id', userId);
    if (updateError) {
      return interaction.reply({ content: 'Fehler beim Abziehen der Coins. Versuche es später erneut.', ephemeral: true });
    }

    // Erfolgsmeldung
    await interaction.reply({ content: `Du hast erfolgreich einen ${boostMessage} gekauft und aktiviert!`, ephemeral: true });
  },
};