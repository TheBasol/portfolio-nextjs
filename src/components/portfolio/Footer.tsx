
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#2A1E70] to-[#1a1456] text-white">
      <div className="w-full px-6 py-12 md:px-8 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center text-center md:text-left">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Enrique Vazquez
            </h3>
            <h4 className="text-lg text-gray-300 font-medium">Software Engineer</h4>
            <p className="text-sm text-gray-400 max-w-xs">
              Creating innovative solutions and exceptional digital experiences
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <Link 
              href="#about" 
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              About Me
            </Link>
            <Link 
              href="#portfolio" 
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              My Portfolio
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium py-2 px-4 rounded-lg hover:bg-white/10"
            >
              Contact Me
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end items-center gap-6">
            <a 
              className="icon linkedin text-gray-300 hover:text-blue-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-blue-400/20" 
              href="https://www.linkedin.com/in/enrique-vazquez-perez-221844228/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile" 
              title="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764c.966 0 1.75.79 1.75 1.764s-.784 1.764-1.75 1.764zm13.5 10.268h-3v-4.5c0-1.072-.021-2.448-1.492-2.448-1.495 0-1.723 1.164-1.723 2.373v4.575h-3v-9h2.881v1.232h.041c.401-.76 1.379-1.56 2.84-1.56 3.038 0 3.6 2.001 3.6 4.6v4.728z"/>
              </svg>
            </a>
            <a 
              className="icon github text-gray-300 hover:text-purple-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-purple-400/20" 
              href="https://github.com/TheBasol" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Profile" 
              title="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.656 1.653.244 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576 4.765-1.589 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              className="icon twitter text-gray-300 hover:text-sky-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-sky-400/20" 
              href="https://twitter.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter Profile" 
              title="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 0 0-8.384 4.482c-4.083-.205-7.702-2.159-10.126-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616c-.054 1.997 1.381 3.872 3.444 4.29a4.935 4.935 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.105c-.396 0-.788-.023-1.17-.068a13.945 13.945 0 0 0 7.548 2.212c9.058 0 14.01-7.513 14.01-14.01 0-.213-.005-.425-.014-.636a10.025 10.025 0 0 0 2.457-2.548l.002-.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-8 pt-6 border-t border-gray-600/50 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Enrique Vazquez. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
