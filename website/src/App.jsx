import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // URL-Parameter auslesen
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const avatar = params.get('avatar');

    if (username && avatar) {
      setUser({ username, avatar });
    }
  }, []);

  if (!user) {
    return <button onClick={loginWithDiscord}>Login mit Discord</button>;
  }

  return (
    <div>
      <nav>
        <p>Willkommen, {user.username}!</p>
        <img
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
          alt={`${user.username}'s Avatar`}
        />
      </nav>
    </div>
  );
}

const loginWithDiscord = () => {
  window.location.href =
    'https://discord.com/oauth2/authorize?client_id=1363531532127437003&response_type=code&redirect_uri=https%3A%2F%2Foctra-bot.vercel.app%2F&scope=identify';
};

export default App;