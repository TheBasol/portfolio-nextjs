"use client";

import React from "react";
import type { ViewState } from "@/lib/navigation";

interface NavigationGuideProps {
  currentView: ViewState;
  onNavigate: (key: string) => void;
}

export const NavigationGuide: React.FC<NavigationGuideProps> = ({ currentView, onNavigate }) => {
  const isHome = currentView === "HOME";
  const canGoUp = isHome || currentView === "ABOUT";
  const canGoDown = isHome || currentView === "PROJECTS";
  const canGoLeft = isHome || currentView === "CONTACT";
  const canGoRight = isHome || currentView === "EXPERIENCE";

  const upLabel = isHome ? "Projects" : currentView === "ABOUT" ? "Home" : "Up";
  const downLabel = isHome ? "About" : currentView === "PROJECTS" ? "Home" : "Down";
  const leftLabel = isHome ? "Experience" : currentView === "CONTACT" ? "Home" : "Left";
  const rightLabel = isHome ? "Contact" : currentView === "EXPERIENCE" ? "Home" : "Right";
  const centerLabel = isHome ? "Home" : "Return Home";

  const getButtonClass = (isActive: boolean, position: string) => {
    const base = `dpad-button dpad-${position}`;
    return isActive ? `${base} dpad-button-active` : base;
  };

  const handleCenter = () => {
    if (currentView === "PROJECTS") onNavigate("arrowdown");
    if (currentView === "ABOUT") onNavigate("arrowup");
    if (currentView === "EXPERIENCE") onNavigate("arrowright");
    if (currentView === "CONTACT") onNavigate("arrowleft");
  };

  return (
    <div className="flex flex-col items-center justify-center select-none drop-shadow-2xl" aria-label="Directional navigation pad">
      <button
        type="button"
        className={`relative ${getButtonClass(currentView === "PROJECTS", "up")}`}
        disabled={!canGoUp}
        onClick={() => canGoUp && onNavigate("arrowup")}
        aria-label={isHome ? "Open Projects" : currentView === "ABOUT" ? "Return Home" : "Navigate Up"}
      >
        <span className="text-sm leading-none">▲</span>
        <span className="dpad-label cube-ui-mono">{upLabel}</span>
      </button>

      <div className="flex items-center justify-center">
        <button
          type="button"
          className={`relative ${getButtonClass(currentView === "EXPERIENCE", "left")}`}
          disabled={!canGoLeft}
          onClick={() => canGoLeft && onNavigate("arrowleft")}
          aria-label={isHome ? "Open Experience" : currentView === "CONTACT" ? "Return Home" : "Navigate Left"}
        >
          <span className="text-sm leading-none">◀</span>
          <span className="dpad-label cube-ui-mono">{leftLabel}</span>
        </button>

        <button
          type="button"
          className={`relative ${getButtonClass(isHome, "center")}`}
          onClick={handleCenter}
          aria-label={centerLabel}
        >
          <div
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              isHome ? "bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]" : "bg-white/25"
            }`}
          />
          <span className="dpad-label cube-ui-mono">{centerLabel}</span>
        </button>

        <button
          type="button"
          className={`relative ${getButtonClass(currentView === "CONTACT", "right")}`}
          disabled={!canGoRight}
          onClick={() => canGoRight && onNavigate("arrowright")}
          aria-label={isHome ? "Open Contact" : currentView === "EXPERIENCE" ? "Return Home" : "Navigate Right"}
        >
          <span className="text-sm leading-none">▶</span>
          <span className="dpad-label cube-ui-mono">{rightLabel}</span>
        </button>
      </div>

      <button
        type="button"
        className={`relative ${getButtonClass(currentView === "ABOUT", "down")}`}
        disabled={!canGoDown}
        onClick={() => canGoDown && onNavigate("arrowdown")}
        aria-label={isHome ? "Open About" : currentView === "PROJECTS" ? "Return Home" : "Navigate Down"}
      >
        <span className="text-sm leading-none">▼</span>
        <span className="dpad-label cube-ui-mono">{downLabel}</span>
      </button>
    </div>
  );
};
