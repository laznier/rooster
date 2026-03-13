// ─────────────────────────────────────────────
// Site-wide configuration
// Edit this file to update navigation, branding, and footer
// ─────────────────────────────────────────────

export const siteConfig = {
  name: 'Laznier Mederos Santos',
  title: 'Strategic Management ePortfolio',
  course: 'MGMT 670 — Strategic Management Capstone',
  university: 'University of Maryland Global Campus',
  professor: 'Dr. R. Dool',
  date: 'March 2026',

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Strategic Analysis', href: '/analysis' },
    { label: 'Artifacts', href: '/artifacts' },
    { label: 'Work Samples', href: '/work-samples' },
    { label: 'Connect', href: '/contact' },
  ],

  social: {
    linkedin: 'https://www.linkedin.com/in/laznier-mederos-santos/',
  },

  footer: {
    line1: '© 2026 Laznier Mederos Santos. All rights reserved.',
    line2:
      'MGMT 670 Strategic Management Capstone — University of Maryland Global Campus',
    line3: 'This ePortfolio was custom-built as part of the Unit 7 comprehensive strategic analysis assignment.',
  },
};
