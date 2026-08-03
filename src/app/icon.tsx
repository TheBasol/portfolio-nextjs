import { ImageResponse } from 'next/og';
import { CubeLogo } from '@/components/seo/CubeLogo';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #120b24 0%, #060606 100%)',
          borderRadius: '8px',
          border: '1px solid rgba(168, 85, 247, 0.5)',
        }}
      >
        <CubeLogo size={20} />
      </div>
    ),
    { ...size }
  );
}
