"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export function SceneLoader() {
  const { progress, active } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState("INITIALIZING_SYSTEM");

  // Determine status message based on progress
  useEffect(() => {
    if (progress < 20) setStatusText("CONNECTING_TO_KERNEL");
    else if (progress < 40) setStatusText("MOUNTING_DISC_IMAGE");
    else if (progress < 60) setStatusText("READING_MEM_CARD_A");
    else if (progress < 80) setStatusText("STREAMING_GEOMETRY");
    else if (progress < 100) setStatusText("COMPILING_SHADERS");
    else setStatusText("SYSTEM_READY");
  }, [progress]);

  // Handle exit transition
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setShouldRender(false), 800);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060606] transition-all duration-700 ease-in-out
        ${isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent_70%)]" />

      {/* 3D Cube Animation (CSS-based) */}
      <div className="relative w-32 h-32 perspective-1000 mb-12">
        <div className="cube-loader-wrapper w-full h-full preserve-3d animate-cube-rotate">
          {/* Faces of the cube */}
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-z-64" />
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-z-64 rotate-y-180" />
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-x-64 rotate-y-90" />
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-x-64 -rotate-y-90" />
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm -translate-y-64 rotate-x-90" />
          <div className="absolute inset-0 bg-indigo-600/20 border border-indigo-400/40 backdrop-blur-sm translate-y-64 -rotate-x-90" />
        </div>

        {/* Inner Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-400 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Loading Info */}
      <div className="relative flex flex-col items-center gap-6 max-w-xs w-full px-8">
        {/* Progress Text */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl font-black italic tracking-tighter text-white">
            {Math.round(progress)}<span className="text-indigo-500 text-3xl">%</span>
          </span>
          <span className="cube-ui-mono text-[10px] uppercase tracking-[0.4em] text-indigo-400/80 animate-pulse">
            {statusText}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* System Logs (Faked but aesthetic) */}
        <div className="flex flex-col gap-1 w-full mt-2">
          <div className="flex justify-between cube-ui-mono text-[8px] text-slate-600 tracking-wider">
            <span>MEM_ADDR_0x00FF</span>
            <span>OK</span>
          </div>
          <div className="flex justify-between cube-ui-mono text-[8px] text-slate-600 tracking-wider">
            <span>GPU_PIPELINE_INIT</span>
            <span className={progress > 80 ? "text-cyan-500/60" : "animate-pulse"}>
              {progress > 80 ? "SUCCESS" : "WAITING"}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
    </div>
  );
}
