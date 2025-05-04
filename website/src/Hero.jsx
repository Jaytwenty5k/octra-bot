import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-700 h-screen flex justify-center items-center text-center text-white">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold animate__animated animate__fadeIn">
          Willkommen bei Octra Bot
        </h1>
        <p className="text-lg animate__animated animate__fadeIn animate__delay-1s">
          Der mächtigste Bot für Discord - Mit Funktionen, die dein Server verbessern.
        </p>
        <a
          href="#"
          className="bg-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Jetzt starten
        </a>
      </div>
    </section>
  );
};

export default Hero;