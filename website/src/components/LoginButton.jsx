import React, { useState } from 'react';

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Hier wird der Discord-Login-Prozess gestartet
    window.location.href = 'DEIN_DISCORD_LOGIN_LINK';
  };

  return (
    <div>
      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Mit Discord einloggen
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <img
            className="h-10 w-10 rounded-full"
            src="USER_AVATAR_URL"
            alt="User Avatar"
          />
          <span className="text-white">Hallo, USERNAME!</span>
        </div>
      )}
    </div>
  );
};

export default LoginButton;