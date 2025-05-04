import React from 'react';
import './Feature.css';

const features = [
  {
    title: 'Automoderation',
    description: 'Erkennt Spam, Links und unerwünschte Inhalte automatisch.',
    icon: '🛡️',
  },
  {
    title: 'Economy-System',
    description: 'Verdiene virtuelle Währungen und kaufe exklusive Inhalte.',
    icon: '💰',
  },
  {
    title: 'Casino',
    description: 'Spiele und gewinne in deinem eigenen Server-Casino.',
    icon: '🎰',
  },
  {
    title: 'Giveaways',
    description: 'Erstelle und verwalte spannende Giveaways.',
    icon: '🎁',
  },
];

const Feature = () => {
  return (
    <div className="feature-container">
      <h1 className="feature-title">Unsere Hauptfunktionen</h1>
      <div className="feature-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h2 className="feature-card-title">{feature.title}</h2>
            <p className="feature-card-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;