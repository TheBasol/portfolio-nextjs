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
  metadataBase: new URL('https://enriquevazquez.me'),
  title: {
    default: 'Enrique Vazquez | Full-Stack Developer — React, Next.js, .NET & AI',
    template: '%s | Enrique Vazquez',
  },
  description:
    'Full-Stack Software Developer specializing in React, Next.js, .NET, and AI-powered applications. Founder of ExanIA — an EdTech SaaS with 260+ users. Open to new opportunities.',
  keywords: [
    'Full-Stack Developer',
    'React Developer',
    'Next.js Developer',
    '.NET Developer',
    'Software Engineer',
    'TypeScript',
    'C#',
    'Python',
    'AI Developer',
    'Enrique Vazquez',
    'Portfolio',
  ],
  authors: [{ name: 'Enrique Vazquez', url: 'https://enriquevazquez.me' }],
  creator: 'Enrique Vazquez',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://enriquevazquez.me',
    siteName: 'Enrique Vazquez — Portfolio',
    title: 'Enrique Vazquez | Full-Stack Developer — React, Next.js, .NET & AI',
    description:
      'Full-Stack Software Developer specializing in React, Next.js, .NET, and AI-powered applications. Founder of ExanIA — an EdTech SaaS with 260+ users.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enrique Vazquez | Full-Stack Developer',
    description:
      'Full-Stack Developer specializing in React, Next.js, .NET & AI. Founder of ExanIA.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="canonical" href="https://enriquevazquez.me" />
      </head>
      <body className={`${roboto.className} ${spaceGrotesk.variable} ${shareTechMono.variable} bg-[#060606] text-white`}>
        {children}
      </body>
    </html>
  );
}