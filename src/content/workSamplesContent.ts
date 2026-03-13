// ─────────────────────────────────────────────
// Additional Work Samples content
// Edit this file to add/update work sample cards
// ─────────────────────────────────────────────

export interface WorkSample {
  id: string;
  title: string;
  description: string;
  category: string;
  relevance: string;
  link?: string;
  linkLabel?: string;
}

export const workSamplesContent = {
  heading: 'Additional Work Samples',
  subheading:
    'Supplementary work samples that demonstrate strategic thinking, analytical capabilities, and professional competence beyond the core course deliverables.',

  samples: [
    {
      id: 'custom-eportfolio',
      title: 'Custom ePortfolio Web Application',
      description:
        'This portfolio website itself — a custom-built Next.js application designed to organize and present strategic analysis, course artifacts, and professional credentials in a polished digital format. Demonstrates the ability to leverage technology for professional communication.',
      category: 'Technology & Digital Communication',
      relevance: 'Demonstrates integration of technical capability with strategic presentation',
    },
    {
      id: 'decision-support-tools',
      title: 'Strategic Decision-Support Analysis',
      description:
        'Development and application of structured analytical approaches to support strategic decision-making, including multi-criteria evaluation matrices and scenario planning exercises.',
      category: 'Strategy & Analysis',
      relevance: 'Demonstrates systematic approach to strategic evaluation and decision-making',
    },
    {
      id: 'leadership-experience',
      title: 'Operational Leadership Portfolio',
      description:
        'Summary of leadership experience across complex organizational environments, demonstrating the ability to align team operations with strategic objectives, manage resources under constraints, and drive results in high-stakes settings.',
      category: 'Leadership & Management',
      relevance: 'Demonstrates practical application of strategic management principles in operational contexts',
    },
  ] as WorkSample[],
};
