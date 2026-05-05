import type { Metadata } from 'next';
import { Roboto, Space_Grotesk, Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Portafolio | Enrique Vazquez',
  description: 'Portafolio de desarrollo web de Enrique Vazquez',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={`${roboto.className} ${spaceGrotesk.variable} ${shareTechMono.variable} bg-[#191C32] text-white`}>
        {children}
      </body>
    </html>
  );
}