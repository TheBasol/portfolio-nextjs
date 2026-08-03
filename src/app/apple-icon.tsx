import { ImageResponse } from 'next/og';
import { CubeLogo } from '@/components/seo/CubeLogo';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #180e30 0%, #060606 100%)',
          borderRadius: '40px',
          border: '3px solid rgba(168, 85, 247, 0.6)',
        }}
      >
        <CubeLogo size={100} />
        <div
          style={{
            fontSize: '16px',
            color: '#22d3ee',
            fontFamily: 'monospace',
            letterSpacing: '4px',
            marginTop: '8px',
            fontWeight: 700,
          }}
        >
          ENRIQUE VAZQUEZ
        </div>
      </div>
    ),
    { ...size }
  );
}
