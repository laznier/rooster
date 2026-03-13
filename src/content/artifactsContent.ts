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
      id: 'unit4-environmental-analysis',
      title: 'Environmental Analysis — Tesla, Inc.',
      description:
        'Comprehensive external environmental assessment applying PESTEL analysis and Porter\'s Five Forces to evaluate the competitive landscape and macro-environmental factors affecting Tesla\'s strategic position.',
      unit: 'Unit 4',
      skillDemonstrated: 'External environmental assessment using multiple strategic frameworks',
      link: undefined,
      linkLabel: 'View Analysis',
    },
    {
      id: 'executive-briefing',
      title: 'Strategic Analysis — Executive Briefing',
      description:
        'Round 1 executive briefing presentation summarizing initial strategic findings, competitive positioning assessment, and preliminary strategic recommendations for Tesla, Inc.',
      unit: 'Unit 7',
      skillDemonstrated: 'Strategic communication and executive-level presentation',
      link: undefined,
      linkLabel: 'View Briefing',
    },
    {
      id: 'strategy-framework-visuals',
      title: 'Strategic Framework Visualizations',
      description:
        'Visual representations of applied strategic frameworks including SWOT matrix, competitive positioning maps, value chain analysis, and strategic group mapping.',
      unit: 'Units 3–7',
      skillDemonstrated: 'Visual communication of strategic analysis',
      link: undefined,
      linkLabel: 'View Visuals',
    },
    {
      id: 'comparative-analysis',
      title: 'Comparative Industry Analysis',
      description:
        'Comparative analysis evaluating Tesla\'s strategic position relative to key competitors, examining differentiation factors, market share dynamics, and competitive sustainability.',
      unit: 'Unit 5',
      skillDemonstrated: 'Competitive analysis and benchmarking',
      link: undefined,
      linkLabel: 'View Analysis',
    },
    {
      id: 'strategic-alternatives-memo',
      title: 'Strategic Alternatives Evaluation',
      description:
        'Structured evaluation of strategic alternatives using feasibility, suitability, and acceptability criteria, with risk assessment and recommended strategic direction.',
      unit: 'Unit 6',
      skillDemonstrated: 'Strategic alternative evaluation and recommendation development',
      link: undefined,
      linkLabel: 'View Memo',
    },
    {
      id: 'discussion-contributions',
      title: 'Discussion Forum Contributions',
      description:
        'Selected contributions to course discussion forums demonstrating critical engagement with strategic management concepts, peer analysis, and evidence-based argumentation.',
      unit: 'Units 1–7',
      skillDemonstrated: 'Critical thinking and professional discourse',
      link: undefined,
      linkLabel: 'View Selections',
    },
  ] as Artifact[],
};
