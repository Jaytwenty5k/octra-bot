// Hilfsfunktionen für allgemeine Aufgaben

/**
 * Überprüft, ob ein Benutzer genug Guthaben hat.
 * @param {Object} wallet - Das Wallet-Objekt des Benutzers
 * @param {number} amount - Der Betrag, der geprüft werden soll
 * @returns {boolean} - Gibt true zurück, wenn der Benutzer genug Guthaben hat, andernfalls false
 */
function hasEnoughBalance(wallet, amount) {
    return wallet.balance >= amount;
  }
  
  /**
   * Berechnet den Gesamtpreis für eine bestimmte Anzahl von Gebäuden.
   * @param {string} buildingType - Der Typ des Gebäudes ('windmill' oder 'solar_panel')
   * @param {number} amount - Die Anzahl der zu kaufenden Gebäude
   * @returns {number} - Der Gesamtpreis
   */
  function calculateBuildingPrice(buildingType, amount) {
    const pricePerUnit = buildingType === 'windmill' ? 500 : 800;
    return pricePerUnit * amount;
  }
  
  /**
   * Formatiert eine Zahl als Währung (z. B. 1000 -> '1,000 Coins').
   * @param {number} amount - Der zu formatierende Betrag
   * @returns {string} - Der formatierte Betrag
   */
  function formatCurrency(amount) {
    return `${amount.toLocaleString()} Coins`;
  }
  
  /**
   * Überprüft, ob ein Benutzer eine bestimmte Levelanforderung erfüllt.
   * @param {number} userLevel - Der aktuelle Level des Benutzers
   * @param {number} requiredLevel - Der erforderliche Level
   * @returns {boolean} - Gibt true zurück, wenn der Benutzer das erforderliche Level erreicht hat
   */
  function meetsLevelRequirement(userLevel, requiredLevel) {
    return userLevel >= requiredLevel;
  }
  
  /**
   * Erstellt eine zufällige Zahl im angegebenen Bereich (inklusive).
   * @param {number} min - Der untere Bereich
   * @param {number} max - Der obere Bereich
   * @returns {number} - Die zufällige Zahl
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Umwandlung eines Zeitstempels in ein lesbares Datumsformat.
   * @param {number} timestamp - Der Zeitstempel
   * @returns {string} - Das formatierte Datum
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }
  
  /**
   * Prüft, ob ein Benutzer eine gültige Eingabe gemacht hat (z. B. eine Zahl).
   * @param {string} input - Die Eingabe des Benutzers
   * @returns {boolean} - Gibt true zurück, wenn die Eingabe gültig ist
   */
  function isValidInput(input) {
    return !isNaN(input) && input.trim() !== '';
  }
  
  export {
    hasEnoughBalance,
    calculateBuildingPrice,
    formatCurrency,
    meetsLevelRequirement,
    getRandomInt,
    formatDate,
    isValidInput
  };