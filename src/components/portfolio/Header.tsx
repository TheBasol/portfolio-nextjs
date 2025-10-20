
import Link from 'next/link';
import SceneWave from '../three/SceneWave';

export const Header = () => {
  return (
    <section id="home" className="w-full min-h-screen flex flex-col md:grid md:grid-cols-[120px_1fr] relative">
      {/* Social Icons - Desktop Sidebar */}
      <div className="hidden md:flex flex-col justify-center items-center gap-6 p-4 z-10 bg-[#191C32] border-r border-gray-700">
        <a className="icon linkedin text-white hover:text-blue-400 transition-all duration-300 hover:scale-110" href="https://www.linkedin.com/in/enrique-vazquez-perez-221844228/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764c.966 0 1.75.79 1.75 1.764s-.784 1.764-1.75 1.764zm13.5 10.268h-3v-4.5c0-1.072-.021-2.448-1.492-2.448-1.495 0-1.723 1.164-1.723 2.373v4.575h-3v-9h2.881v1.232h.041c.401-.76 1.379-1.56 2.84-1.56 3.038 0 3.6 2.001 3.6 4.6v4.728z"/>
          </svg>
        </a>
        <a className="icon github text-white hover:text-purple-400 transition-all duration-300 hover:scale-110" href="https://github.com/TheBasol" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.656 1.653.244 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576 4.765-1.589 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a className="icon twitter text-white hover:text-sky-400 transition-all duration-300 hover:scale-110" href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" title="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 0 0-8.384 4.482c-4.083-.205-7.702-2.159-10.126-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616c-.054 1.997 1.381 3.872 3.444 4.29a4.935 4.935 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.105c-.396 0-.788-.023-1.17-.068a13.945 13.945 0 0 0 7.548 2.212c9.058 0 14.01-7.513 14.01-14.01 0-.213-.005-.425-.014-.636a10.025 10.025 0 0 0 2.457-2.548l.002-.003z"/>
          </svg>
        </a>
      </div>

      {/* Mobile Social Icons - Top */}
      <div className="md:hidden flex justify-center items-center gap-8 p-4 bg-[#191C32] border-b border-gray-700">
        <a className="icon linkedin text-white hover:text-blue-400 transition-all duration-300 hover:scale-110" href="https://www.linkedin.com/in/enrique-vazquez-perez-221844228/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764c.966 0 1.75.79 1.75 1.764s-.784 1.764-1.75 1.764zm13.5 10.268h-3v-4.5c0-1.072-.021-2.448-1.492-2.448-1.495 0-1.723 1.164-1.723 2.373v4.575h-3v-9h2.881v1.232h.041c.401-.76 1.379-1.56 2.84-1.56 3.038 0 3.6 2.001 3.6 4.6v4.728z"/>
          </svg>
        </a>
        <a className="icon github text-white hover:text-purple-400 transition-all duration-300 hover:scale-110" href="https://github.com/TheBasol" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.289-1.552 3.295-1.23 3.295-1.23.656 1.653.244 2.874.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .319.216.694.825.576 4.765-1.589 8.2-6.084 8.2-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
        <a className="icon twitter text-white hover:text-sky-400 transition-all duration-300 hover:scale-110" href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" title="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 0 0-8.384 4.482c-4.083-.205-7.702-2.159-10.126-5.134a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616c-.054 1.997 1.381 3.872 3.444 4.29a4.935 4.935 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.105c-.396 0-.788-.023-1.17-.068a13.945 13.945 0 0 0 7.548 2.212c9.058 0 14.01-7.513 14.01-14.01 0-.213-.005-.425-.014-.636a10.025 10.025 0 0 0 2.457-2.548l.002-.003z"/>
          </svg>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center gap-8 p-4 px-6 md:p-8 min-h-[calc(100vh-80px)] md:min-h-screen relative">
        {/* SceneWave as background */}
        <div className="absolute inset-0 w-full h-full">
          <SceneWave/>
        </div>
        {/* Content overlay */}
        <div className="flex justify-center items-center flex-col gap-6 bg-[rgba(25,28,50,0.9)] backdrop-blur-sm w-full max-w-2xl p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-700/50 text-center relative z-10">
          <h3 className="text-gray-300 text-lg md:text-xl font-light tracking-wide">Welcome To My Portfolio Web</h3>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Hola, Soy <span className="text-[#818bd4] bg-gradient-to-r from-[#818bd4] to-[#4d67f0] bg-clip-text text-transparent">Ingeniero de Software</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-md leading-relaxed">
            Creando aplicaciones modernas y responsivas con las últimas tecnologías
          </p>
          <Link href="#contact" className="flex justify-center items-center gap-3 w-56 h-14 text-white bg-gradient-to-r from-[#482ebb] to-[#4d67f0] rounded-xl cursor-pointer hover:from-[#5a3ad4] hover:to-[#6b7ff7] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg">
            Contact Me
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
          <div className="w-12 h-12 mt-6 animate-bounce" style={{ 
            background: "url('https://api.iconify.design/mdi/mouse-move-down.svg?color=%234d67f0') no-repeat center center / contain" 
          }}></div>
        </div>
      </div>
    </section>
  );
};
