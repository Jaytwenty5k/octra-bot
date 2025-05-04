import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const servers = [
    { name: 'Server 1', members: 120, status: 'Aktiv' },
    { name: 'Server 2', members: 85, status: 'Inaktiv' },
    { name: 'Server 3', members: 200, status: 'Aktiv' },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dein Dashboard</h1>
      <div className="server-list">
        {servers.map((server, index) => (
          <div key={index} className="server-card">
            <h2 className="server-name">{server.name}</h2>
            <p className="server-members">Mitglieder: {server.members}</p>
            <p className={`server-status ${server.status === 'Aktiv' ? 'active' : 'inactive'}`}>{server.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;