import { supabase } from '../../supabase/supabase.js';

/**
 * Funktion zum Hinzufügen von XP für den Job eines Benutzers.
 * 
 * @param {string} userId - Die Discord-ID des Benutzers.
 * @param {string} jobId - Die Job-ID des Benutzers.
 */
async function addJobXP(userId, jobId) {
  // Hole die aktuellen XP- und Level-Daten des Benutzers für den angegebenen Job
  const { data: jobData, error } = await supabase
    .from('user_jobs')
    .select('xp, level')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .single();
  
  if (error) {
    console.error('Fehler beim Abrufen der Job-Daten:', error);
    return;
  }

  // XP hinzufügen (z. B. 10 XP pro Stunde Arbeit)
  const newXP = jobData.xp + 10;

  // Berechnung des neuen Levels (kann nach deinem System angepasst werden)
  const newLevel = Math.floor(newXP / 100);  // Level steigt alle 100 XP

  // Update der XP und Level in der Datenbank
  const { error: updateError } = await supabase
    .from('user_jobs')
    .update({ xp: newXP, level: newLevel })
    .eq('user_id', userId)
    .eq('job_id', jobId);
  
  if (updateError) {
    console.error('Fehler beim Aktualisieren der Job-Daten:', updateError);
  } else {
    console.log(`Job-Daten für Benutzer ${userId} aktualisiert: XP = ${newXP}, Level = ${newLevel}`);
  }
}

export { addJobXP };