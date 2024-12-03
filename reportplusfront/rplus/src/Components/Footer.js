// Footer.js
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-300 py-6">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <div className="text-3xl font-bold text-black tracking-wide">
          R<span className="text-black">+</span>
        </div>
        
        {/* Contact Link */}
        <div>
          <a href="/contact" className="text-gray-700 hover:text-black transition-colors">
            Contate-nos
          </a>
        </div>
      </div>
      <div className="container mx-auto text-center mt-4 text-gray-600 text-sm">
        © 2024 by Report+, Inc. All rights reserved.
      </div>
    </footer>
  );
}
