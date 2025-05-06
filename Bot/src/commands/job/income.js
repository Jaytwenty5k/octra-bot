import { SlashCommandBuilder } from 'discord.js';
import { supabase } from '../../utils/supabaseClient.js';

export default {
  data: new SlashCommandBuilder()
    .setName('collect_income')
    .setDescription('Fordere dein Einkommen aus Windrädern oder Solaranlagen an!'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Überprüfen, ob der Benutzer Windräder oder Solaranlagen besitzt
    const { data: userBuildings, error } = await supabase
      .from('user_buildings')
      .select('windmills, solar_panels')
      .eq('discord_id', userId)
      .single();
    
    if (error || !userBuildings) {
      return interaction.reply({ content: 'Du besitzt keine Windräder oder Solaranlagen!', ephemeral: true });
    }

    const { windmills, solar_panels } = userBuildings;

    let income = 0;

    // Berechne das Einkommen aus Windrädern und Solaranlagen
    if (windmills > 0) {
      income += windmills * 100; // Beispiel: 100 pro Windrad
    }

    if (solar_panels > 0) {
      income += solar_panels * 150; // Beispiel: 150 pro Solaranlage
    }

    if (income > 0) {
      // Füge das Einkommen dem Benutzerkonto hinzu
      const { error: incomeError } = await supabase
        .from('wallets')
        .upsert({
          discord_id: userId,
          balance: income
        });

      if (incomeError) {
        return interaction.reply({ content: 'Fehler beim Hinzufügen des Einkommens.', ephemeral: true });
      }

      return interaction.reply({ content: `Du hast **${income}** verdient!` });
    } else {
      return interaction.reply({ content: 'Du hast keine Einkommensquelle, die beansprucht werden kann.', ephemeral: true });
    }
  },
};