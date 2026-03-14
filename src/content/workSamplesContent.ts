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
      id: 'competitive-position-tool',
      title: 'Competitive Position Analysis (CPA) Report',
      description:
        'A comprehensive strategic report generated using the CPA tool at projectmanagerhelper.com. Performs weighted competitive scoring, value curve analysis, strategic group mapping, benchmarking, and comparative SWOT/PESTEL/Five Forces assessments across Tesla and key EV industry competitors. Features publication-quality visualizations and structured data summaries.',
      category: 'Strategy & Analytics',
      relevance: 'Demonstrates the ability to leverage purpose-built strategic analysis tools for data-driven competitive assessment',
      link: '/assets/pdfs/CPA_TOOL_Tesla_Inc_Strategic_Opportunity_Analysis_2026-03-13_REPORT.pdf',
      linkLabel: 'View CPA Report (PDF)',
    },
    {
      id: 'custom-eportfolio',
      title: 'Custom ePortfolio Web Application',
      description:
        'This portfolio website itself — a custom-built Next.js application designed to organize and present strategic analysis, course artifacts, and professional credentials in a polished digital format. Built with TypeScript, Tailwind CSS, and deployed via Vercel for professional-grade performance and presentation.',
      category: 'Technology & Digital Communication',
      relevance: 'Demonstrates integration of technical capability with strategic presentation and professional communication',
    },
    {
      id: 'risk-analysis-reports',
      title: 'Strategic Risk Assessment and Mitigation Reports',
      description:
        'Comprehensive risk analysis reports evaluating the risks of strategic pivot implementation and detailed implementation risk assessments with mitigation strategies for each major risk category. Demonstrates systematic risk identification, evaluation, and mitigation planning.',
      category: 'Strategy & Risk Management',
      relevance: 'Demonstrates systematic risk management thinking and implementation planning capabilities',
      link: '/assets/pdfs/Tesla%20implementation%20risk%20report.pdf',
      linkLabel: 'View Risk Report',
    },
  ] as WorkSample[],
};
