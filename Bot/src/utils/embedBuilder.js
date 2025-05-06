import { EmbedBuilder } from 'discord.js';

// Funktion zum Erstellen eines einfachen Embeds
function createSimpleEmbed(title, description, color = '#0099ff') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

// Funktion zum Erstellen eines detaillierten Embeds mit Feldern
function createDetailedEmbed(title, description, fields = [], color = '#0099ff') {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  // Felder hinzufügen, falls vorhanden
  if (fields.length > 0) {
    fields.forEach(field => {
      embed.addFields(field);
    });
  }

  return embed;
}

// Funktion zum Erstellen eines Embeds mit einem Footer
function createEmbedWithFooter(title, description, footerText, color = '#0099ff') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: footerText })
    .setTimestamp();
}

// Funktion zum Erstellen eines Embeds mit Autor
function createEmbedWithAuthor(title, description, authorName, authorIconUrl, color = '#0099ff') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setAuthor({ name: authorName, iconURL: authorIconUrl })
    .setTimestamp();
}

// Funktion zum Erstellen eines Fehlermeldungs-Embeds
function createErrorEmbed(message, color = '#ff0000') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle('Fehler')
    .setDescription(message)
    .setTimestamp();
}

// Funktion zum Erstellen eines Erfolgs-Embeds
function createSuccessEmbed(message, color = '#00ff00') {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle('Erfolg')
    .setDescription(message)
    .setTimestamp();
}

// Exporte der Funktionen
export {
  createSimpleEmbed,
  createDetailedEmbed,
  createEmbedWithFooter,
  createEmbedWithAuthor,
  createErrorEmbed,
  createSuccessEmbed
};