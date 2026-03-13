// ─────────────────────────────────────────────
// Home page content
// Edit this file to update the landing page
// ─────────────────────────────────────────────

export const homeContent = {
  hero: {
    greeting: 'Strategic Management ePortfolio',
    name: 'Laznier Mederos Santos',
    headline:
      'Strategic Leadership · Systems Thinking · Comprehensive Analysis',
    subheadline:
      'This ePortfolio presents the culmination of strategic management coursework completed as part of the MGMT 670 Strategic Management Capstone at the University of Maryland Global Campus. It features a comprehensive strategic analysis of Tesla, Inc., alongside course artifacts that demonstrate the application of strategic frameworks, cross-functional knowledge synthesis, and evidence-based decision-making.',
  },

  introduction: {
    heading: 'Portfolio Overview',
    text: 'This digital portfolio is organized to provide clear access to the key deliverables and supporting evidence developed throughout the course. The centerpiece is a comprehensive strategic analysis that integrates external and internal assessments, evaluates strategic alternatives, and presents detailed recommendations with implementation considerations. Supporting artifacts and work samples demonstrate the breadth of strategic management competencies developed across all course units.',
  },

  previewCards: [
    {
      title: 'About Me',
      description:
        'Professional background, leadership experience, and strategic management expertise.',
      href: '/about',
      icon: 'user' as const,
    },
    {
      title: 'Strategic Analysis',
      description:
        'Comprehensive strategic analysis of Tesla, Inc. — the centerpiece of this portfolio.',
      href: '/analysis',
      icon: 'chart' as const,
    },
    {
      title: 'Course Artifacts',
      description:
        'Key deliverables from across the course demonstrating strategic analysis capabilities.',
      href: '/artifacts',
      icon: 'folder' as const,
    },
    {
      title: 'Work Samples',
      description:
        'Additional relevant work samples showcasing strategic thinking and analytical tools.',
      href: '/work-samples',
      icon: 'briefcase' as const,
    },
  ],
};
