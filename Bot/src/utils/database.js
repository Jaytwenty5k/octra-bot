import { createClient } from '@supabase/supabase-js';

// Deine Supabase-URL und API-Schlüssel (sicherstellen, dass du diese nicht öffentlich teilst)
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key'; // Verwende hier den öffentlichen Schlüssel (anon-key) für die Anfragen

// Supabase-Client erstellen
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Funktion zum Abrufen des Benutzer-Kontos
async function getUserAccount(discordId) {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('discord_id', discordId)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Fehler beim Abrufen des Benutzerkontos:', err);
    throw err;
  }
}

// Funktion zum Hinzufügen eines Haustiers
async function addPet(userId, petType, incomeBonus) {
  try {
    const { error } = await supabase
      .from('pets')
      .insert([
        {
          discord_id: userId,
          pet_type: petType,
          income_bonus: incomeBonus,
          active: true,
        },
      ]);
    if (error) throw error;
    console.log(`Haustier ${petType} erfolgreich hinzugefügt.`);
  } catch (err) {
    console.error('Fehler beim Hinzufügen des Haustiers:', err);
    throw err;
  }
}

// Funktion zum Aktualisieren des Kontostands
async function updateBalance(discordId, amount) {
  try {
    const { error } = await supabase
      .from('wallets')
      .update({ balance: amount })
      .eq('discord_id', discordId);
    if (error) throw error;
    console.log('Kontostand erfolgreich aktualisiert.');
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Kontostands:', err);
    throw err;
  }
}

// Funktion zum Hinzufügen eines Gebäudes (z. B. Windräder oder Solaranlagen)
async function addBuilding(userId, buildingType, amount) {
  try {
    const { error } = await supabase
      .from('user_buildings')
      .upsert({
        discord_id: userId,
        [buildingType === 'windmill' ? 'windmills' : 'solar_panels']: amount,
      });
    if (error) throw error;
    console.log(`${amount} ${buildingType} erfolgreich hinzugefügt.`);
  } catch (err) {
    console.error('Fehler beim Hinzufügen des Gebäudes:', err);
    throw err;
  }
}

// Exporte der Funktionen
export { getUserAccount, addPet, updateBalance, addBuilding };