import React from 'react';

const Features = () => {
  return (
    <section className="bg-gray-800 py-16 text-white">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-700 p-6 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Feature 1</h3>
          <p>Beschreibung des ersten Features, das den Benutzern hilft, ihre Server zu verbessern.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Feature 2</h3>
          <p>Beschreibung des zweiten Features, das den Benutzern hilft, ihre Server zu verbessern.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Feature 3</h3>
          <p>Beschreibung des dritten Features, das den Benutzern hilft, ihre Server zu verbessern.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;