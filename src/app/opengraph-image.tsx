import { ImageResponse } from 'next/og';
import { MainOgTemplate } from '@/components/seo/MainOgTemplate';

export const runtime = 'edge';

export const alt = 'Enrique Vazquez — Full-Stack Software Developer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(<MainOgTemplate />, { ...size });
}
