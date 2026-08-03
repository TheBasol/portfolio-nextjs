import React from 'react';

export function MainOgTemplate() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#060606',
        padding: '60px 80px',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.25) 0%, rgba(6,6,6,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(6,6,6,0) 70%)',
        }}
      />

      {/* Outer Tech Border */}
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Bar / System Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#a855f7',
            fontSize: '14px',
            fontFamily: 'monospace',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22d3ee',
            }}
          />
          SYSTEM // ENRIQUE_VAZQUEZ
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontFamily: 'monospace',
            letterSpacing: '2px',
          }}
        >
          ENRIQUEVAZQUEZ.ME
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 10,
          marginTop: '20px',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            color: '#22d3ee',
            fontFamily: 'monospace',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Full-Stack Software Developer
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}
        >
          ENRIQUE VAZQUEZ
        </div>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.65)',
            maxWidth: '850px',
            lineHeight: 1.5,
            marginTop: '4px',
          }}
        >
          Building AI-Powered Applications & Scalable Web Architecture using React, Next.js, .NET Core, and Python.
        </div>
      </div>

      {/* Bottom Badges & Tech Stack */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          {['React / Next.js', '.NET / C#', 'Python', 'AI & RAG', 'GCP'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '20px',
            backgroundColor: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#d8b4fe',
            fontSize: '14px',
            fontFamily: 'monospace',
            fontWeight: 700,
          }}
        >
          Founder of ExanIA (EdTech)
        </div>
      </div>
    </div>
  );
}
