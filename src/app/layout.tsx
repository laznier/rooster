import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rooster — Portable Voice-Driven C2 Training',
  description:
    'Rooster is an early-stage venture building portable, voice-driven command-and-control training tools that supplement scarce enterprise simulators.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Rooster — Portable Voice-Driven C2 Training',
    description:
      'Portable, voice-driven command-and-control training that supplements scarce enterprise simulators.',
    type: 'website',
    siteName: 'Rooster',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="flex min-h-screen flex-col bg-navy-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
