import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { ConditionalFooter } from '@/components/ConditionalFooter';

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
      </head>
      <body className="flex min-h-screen flex-col bg-navy-950">
        <Header />
        <main className="flex-1">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
