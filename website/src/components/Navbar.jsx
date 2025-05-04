import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 p-4 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center">
        <div className="text-white text-2xl font-semibold">Octra Bot</div>
        
        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Menu Items */}
        <div className={`lg:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <a href="#" className="text-white hover:text-blue-500 transition-all duration-300">Home</a>
          <a href="#" className="text-white hover:text-blue-500 transition-all duration-300">Features</a>
          <a href="#" className="text-white hover:text-blue-500 transition-all duration-300">Pricing</a>
          <a href="#" className="text-white hover:text-blue-500 transition-all duration-300">Support</a>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-4">
          <div className="text-white">Hello, User!</div>
          <img
            className="h-10 w-10 rounded-full"
            src="https://cdn.discordapp.com/avatars/USER_ID/AVATAR.png"
            alt="User Avatar"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;