// ─────────────────────────────────────────────
// Course Artifacts content
// Edit this file to add/update artifact cards
// ─────────────────────────────────────────────

export interface Artifact {
  id: string;
  title: string;
  description: string;
  unit: string;
  skillDemonstrated: string;
  link?: string;            // URL or file path (optional)
  linkLabel?: string;       // e.g. "View Document", "Download PDF"
}

export const artifactsContent = {
  heading: 'Course Artifacts',
  subheading:
    'Key deliverables from MGMT 670 that demonstrate strategic analysis capabilities and cross-functional knowledge synthesis.',

  artifacts: [
    {
      id: 'competitive-position-report',
      title: 'Competitive Position Analysis — Full Interactive Report',
      description:
        'Comprehensive competitive positioning report featuring weighted scoring, value curves, strategic group mapping, benchmarking, SWOT, PESTEL, and Porter\'s Five Forces analyses across Tesla and key competitors. Includes interactive charts and detailed comparative data.',
      unit: 'Unit 7',
      skillDemonstrated: 'Multi-framework competitive analysis and data-driven strategic assessment',
      link: '/assets/html/Tesla_Inc_Strategic_Opportunity_Analysis_2026-03-13_REPORT.html',
      linkLabel: 'View Interactive Report',
    },
    {
      id: 'executive-briefing',
      title: 'Tesla Executive Briefing — Presentation Slides',
      description:
        'Final executive briefing presentation summarizing strategic findings, competitive positioning assessment, and strategic recommendations for Tesla, Inc. Designed for stakeholder communication at the executive level.',
      unit: 'Unit 7',
      skillDemonstrated: 'Strategic communication and executive-level presentation',
      link: '/assets/slides/Tesla_Executive_Briefing_Slides_Final.pptx',
      linkLabel: 'Download Slides',
    },
    {
      id: 'risk-strategic-pivot',
      title: 'Risk of Strategic Pivot — Implementation Analysis',
      description:
        'Detailed risk report analyzing the risks associated with Tesla\'s strategic pivot, including risk identification, probability and impact assessment, and mitigation strategies for each major risk category.',
      unit: 'Unit 7',
      skillDemonstrated: 'Risk assessment, mitigation planning, and strategic implementation analysis',
      link: '/assets/pdfs/Tesla%20-%20Risk%20of%20Strategic%20Pivot%20Implementation.pdf',
      linkLabel: 'View Risk Report',
    },
    {
      id: 'implementation-risk-report',
      title: 'Tesla Implementation Risk Report',
      description:
        'Comprehensive implementation risk report covering operational, financial, market, and organizational risks associated with the recommended strategic direction, with detailed mitigation plans for each identified risk.',
      unit: 'Unit 7',
      skillDemonstrated: 'Implementation planning, risk management, and systems thinking',
      link: '/assets/pdfs/Tesla%20implementation%20risk%20report.pdf',
      linkLabel: 'View Risk Report',
    },
    {
      id: 'strategy-framework-visuals',
      title: 'Strategic Framework Visualizations',
      description:
        'Visual representations of applied strategic frameworks including PESTEL radar charts, Porter\'s Five Forces analysis, SWOT matrix, value curves, strategic group mapping, weighted competitive scoring, and benchmarking comparisons.',
      unit: 'Units 3–7',
      skillDemonstrated: 'Visual communication of strategic analysis using multiple frameworks',
      link: '/analysis',
      linkLabel: 'View in Strategic Analysis',
    },
    {
      id: 'unit4-environmental-analysis',
      title: 'Environmental Analysis — Tesla, Inc.',
      description:
        'External environmental assessment applying PESTEL analysis and Porter\'s Five Forces to evaluate the competitive landscape and macro-environmental factors affecting Tesla\'s strategic position across U.S., European, and Chinese markets. Includes annotated slide deck with speaker notes.',
      unit: 'Unit 4',
      skillDemonstrated: 'External environmental assessment using multiple strategic frameworks',
      link: '/assets/slides/Mederos_Tesla_Unit4_Final_SlideDeck_WithNotes.pptx',
      linkLabel: 'Download Slide Deck',
    },
  ] as Artifact[],
};
