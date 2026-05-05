"use client";

import React from "react";

type ViewState = "HOME" | "PROJECTS" | "ABOUT" | "EXPERIENCE" | "CONTACT";

interface NavigationGuideProps {
  currentView: ViewState;
  onNavigate: (key: string) => void;
}

export const NavigationGuide: React.FC<NavigationGuideProps> = ({ currentView, onNavigate }) => {
  // Helpers to determine if a direction is active or available
  const isHome = currentView === "HOME";
  const canGoUp = isHome || currentView === "ABOUT";
  const canGoDown = isHome || currentView === "PROJECTS";
  const canGoLeft = isHome || currentView === "CONTACT";
  const canGoRight = isHome || currentView === "EXPERIENCE";

  const getButtonClass = (isActive: boolean, isAvailable: boolean, position: string) => {
    const base = "flex items-center justify-center w-12 h-12 md:w-14 md:h-14 transition-all duration-300 backdrop-blur-md bg-[#0a0a0a]/80";
    
    // Border styling based on position to create a cohesive cross shape
    let borders = "";
    if (position === "up") borders = "border-t border-l border-r rounded-t-lg";
    if (position === "down") borders = "border-b border-l border-r rounded-b-lg";
    if (position === "left") borders = "border-t border-b border-l rounded-l-lg";
    if (position === "right") borders = "border-t border-b border-r rounded-r-lg";
    if (position === "center") borders = "border";

    if (isActive && position !== "center") {
      return `${base} ${borders} border-purple-500/60 bg-purple-900/30 text-purple-200 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]`;
    }
    if (isAvailable) {
      return `${base} ${borders} border-white/10 text-white/40 hover:bg-white/5 hover:border-purple-500/40 hover:text-purple-300 cursor-pointer active:scale-95`;
    }
    return `${base} ${borders} border-white/5 text-white/10 cursor-not-allowed`;
  };

  return (
    <div className="flex flex-col items-center justify-center select-none pointer-events-auto drop-shadow-2xl">
      {/* UP BUTTON */}
      <div 
        className={getButtonClass(currentView === "PROJECTS", canGoUp, "up")}
        onClick={() => canGoUp && onNavigate("arrowup")}
        role="button"
        aria-label="Navigate Up"
      >
        <span className="text-sm md:text-base leading-none">▲</span>
      </div>

      <div className="flex items-center justify-center">
        {/* LEFT BUTTON */}
        <div 
          className={getButtonClass(currentView === "EXPERIENCE", canGoLeft, "left")}
          onClick={() => canGoLeft && onNavigate("arrowleft")}
          role="button"
          aria-label="Navigate Left"
        >
          <span className="text-sm md:text-base leading-none">◀</span>
        </div>

        {/* CENTER BUTTON (HOME) */}
        <div 
          className={getButtonClass(isHome, true, "center")}
          onClick={() => {
            if (currentView === "PROJECTS") onNavigate("arrowdown");
            if (currentView === "ABOUT") onNavigate("arrowup");
            if (currentView === "EXPERIENCE") onNavigate("arrowright");
            if (currentView === "CONTACT") onNavigate("arrowleft");
          }}
          role="button"
          aria-label="Navigate Home"
        >
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${isHome ? "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" : "bg-white/20"}`} />
        </div>

        {/* RIGHT BUTTON */}
        <div 
          className={getButtonClass(currentView === "CONTACT", canGoRight, "right")}
          onClick={() => canGoRight && onNavigate("arrowright")}
          role="button"
          aria-label="Navigate Right"
        >
          <span className="text-sm md:text-base leading-none">▶</span>
        </div>
      </div>

      {/* DOWN BUTTON */}
      <div 
        className={getButtonClass(currentView === "ABOUT", canGoDown, "down")}
        onClick={() => canGoDown && onNavigate("arrowdown")}
        role="button"
        aria-label="Navigate Down"
      >
        <span className="text-sm md:text-base leading-none">▼</span>
      </div>
    </div>
  );
};
