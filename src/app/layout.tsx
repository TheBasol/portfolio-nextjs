import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Head from 'next/head';
import { Navbar } from '@/components';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Portafolio | Enrique Vazquez',
  description: 'Portafolio de desarrollo web de Enrique Vazquez',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${roboto.className} bg-[#191C32] text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}