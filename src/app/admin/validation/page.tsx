import type { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const metadata: Metadata = {
  title: 'Rooster C2 — Validation Admin',
  robots: { index: false, follow: false },
};

export default function AdminValidationPage() {
  return <AdminClient />;
}
