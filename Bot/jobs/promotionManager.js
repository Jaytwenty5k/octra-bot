async function checkPromotionAndReward(userId, jobId) {
    const { data: jobData, error } = await supabase
      .from('user_jobs')
      .select('level')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();
  
    if (error) {
      console.error('Fehler beim Abrufen der Job-Daten:', error);
      return;
    }
  
    // Beispiel: Wenn der Benutzer Level 5 erreicht, bekommt er eine Belohnung
    if (jobData.level === 5) {
      // Belohnung vergeben (z. B. Geld, Item)
      const { error: rewardError } = await supabase
        .from('user_wallets')
        .upsert({
          user_id: userId,
          balance: 1000  // Beispiel: 1000 Einheiten Geld als Belohnung
        });
  
      if (rewardError) {
        console.error('Fehler beim Vergeben der Belohnung:', rewardError);
      }
    }
  }