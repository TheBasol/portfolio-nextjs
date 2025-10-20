'use client';

import { useState } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 bg-[#191C32]/95 backdrop-blur-md border-b border-gray-700/50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h4 className="text-white text-xl font-bold bg-gradient-to-r from-[#818bd4] to-[#4d67f0] bg-clip-text text-transparent">
            Enrique Vazquez
          </h4>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link 
              href="#home" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="#about" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              About Me
            </Link>
          </li>
          <li>
            <Link 
              href="#portfolio" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link 
              href="#contact" 
              className="text-gray-300 hover:text-white transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 text-white hover:text-[#818bd4] transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
          <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`
          md:hidden absolute top-full left-0 w-full
          transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
          transition-all duration-300 ease-in-out
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          bg-[#191C32]/98 backdrop-blur-md border-b border-gray-700/50
          shadow-xl
        `}>
          <ul className="flex flex-col py-4">
            <li>
              <Link 
                href="#home" 
                className="block px-6 py-4 text-white hover:text-[#818bd4] hover:bg-white/5 transition-all duration-300 font-medium border-b border-gray-700/30"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="#about" 
                className="block px-6 py-4 text-white hover:text-[#818bd4] hover:bg-white/5 transition-all duration-300 font-medium border-b border-gray-700/30"
                onClick={() => setIsOpen(false)}
              >
                About Me
              </Link>
            </li>
            <li>
              <Link 
                href="#portfolio" 
                className="block px-6 py-4 text-white hover:text-[#818bd4] hover:bg-white/5 transition-all duration-300 font-medium border-b border-gray-700/30"
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link 
                href="#contact" 
                className="block px-6 py-4 text-white hover:text-[#818bd4] hover:bg-white/5 transition-all duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
};
