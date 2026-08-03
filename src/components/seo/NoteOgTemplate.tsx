import React from 'react';

interface NoteOgTemplateProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
}

export function NoteOgTemplate({
  title,
  description,
  date,
  tags,
}: NoteOgTemplateProps) {
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
          top: '-20%',
          right: '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(6,6,6,0) 70%)',
        }}
      />

      {/* Outer Tech Border */}
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header */}
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
            color: '#22d3ee',
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
              backgroundColor: '#a855f7',
            }}
          />
          MEMORY CARD // LOG {date}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontFamily: 'monospace',
            letterSpacing: '2px',
          }}
        >
          ENRIQUEVAZQUEZ.ME/NOTES
        </div>
      </div>

      {/* Note Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 10,
          maxWidth: '1000px',
          marginTop: '10px',
        }}
      >
        <div
          style={{
            fontSize: '52px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.5,
          }}
        >
          {description.length > 160
            ? description.substring(0, 160) + '...'
            : description}
        </div>
      </div>

      {/* Footer info */}
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
          {tags.slice(0, 4).map((tag: string) => (
            <div
              key={tag}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#d8b4fe',
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
            fontSize: '16px',
            color: '#ffffff',
            fontFamily: 'monospace',
            fontWeight: 700,
          }}
        >
          Enrique Vazquez — Engineering Notes
        </div>
      </div>
    </div>
  );
}
