import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-background"></div>
      <div className="hero-content">
        <h1 className="hero-title">StartIT Bot – Der beste Bot für Discord</h1>
        <p className="hero-subtitle">Erlebe die nächste Generation von Discord-Bots</p>
        <Link to="/features" className="hero-button">Unsere Funktionen</Link>
        <Link to="/dashboard" className="hero-button">Zum Dashboard</Link>
        <Link to="/support" className="hero-button">Support & FAQ</Link>
      </div>
    </div>
  );
}