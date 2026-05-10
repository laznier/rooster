import type { Metadata } from 'next';
import { ValidationFlow } from './ValidationFlow';

export const metadata: Metadata = {
  title: 'Rooster C2 — Validation Interview',
  description:
    'Confidential, unclassified customer-discovery interview for the Rooster C2 training venture.',
  robots: { index: false, follow: false },
};

export default function ValidationPage({
  searchParams,
}: {
  searchParams: { invite?: string };
}) {
  const invite = (searchParams?.invite || '').trim();
  return <ValidationFlow initialInvite={invite} />;
}
