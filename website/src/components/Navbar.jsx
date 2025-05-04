import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/auth/user", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  const logout = () => {
    fetch("http://localhost:3001/auth/logout", {
      credentials: "include"
    }).then(() => setUser(null));
  };

  return (
    <nav className="bg-gray-800 px-4 py-3 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-white">Octra Bot</a>
        <div>
          {user ? (
            <div className="flex items-center gap-2">
              <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="avatar" className="w-8 h-8 rounded-full" />
              <span className="text-white">{user.username}</span>
              <button onClick={logout} className="ml-2 text-sm text-gray-300 hover:text-white">Logout</button>
            </div>
          ) : (
            <a href="https://discord.com/oauth2/authorize?client_id=1363531532127437003&response_type=code&redirect_uri=https%3A%2F%2Foctra-bot.vercel.app%2F&scope=identify" className="text-white">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
}