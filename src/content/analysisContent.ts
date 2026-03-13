// ─────────────────────────────────────────────
// Strategic Analysis page content (Tesla, Inc.)
// This is the centerpiece of the portfolio.
//
// HOW TO EDIT:
// Replace the placeholder text in each section
// with your final analysis content.
// Sections mirror the assignment structure exactly.
// ─────────────────────────────────────────────

export interface AnalysisSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];          // Array of paragraphs (HTML strings supported)
  subsections?: {
    title: string;
    content: string[];
  }[];
  charts?: {
    label: string;            // Caption / alt text
    placeholder: string;      // Path to image or 'placeholder'
    description?: string;     // Brief note about what this chart shows
  }[];
}

export const analysisMetadata = {
  title: 'Comprehensive Strategic Analysis',
  subtitle: 'Tesla, Inc.',
  course: 'MGMT 670 — Strategic Management Capstone',
  university: 'University of Maryland Global Campus',
  author: 'Laznier Mederos Santos',
  professor: 'Dr. R. Dool',
  date: 'March 11, 2026',
  briefingRound: 'Round 1 — Executive Briefing',
};

export const analysisSections: AnalysisSection[] = [
  // ── Executive Summary ──────────────────────
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    content: [
      '[PLACEHOLDER — Replace with your executive summary. This section should provide a concise overview of key findings and recommendations from your comprehensive strategic analysis of Tesla, Inc. Include the primary strategic position assessment, the recommended strategic direction, and the most critical implementation considerations. Target approximately one page.]',
    ],
  },

  // ── Comprehensive Situation Analysis ───────
  {
    id: 'situation-analysis',
    title: 'Comprehensive Situation Analysis',
    content: [
      'This section integrates external environmental assessment, internal capability evaluation, and competitive positioning to establish a holistic understanding of Tesla\'s current strategic situation.',
    ],
    subsections: [
      {
        title: 'External Environmental Assessment',
        content: [
          '[PLACEHOLDER — Replace with your PESTEL analysis of Tesla\'s external environment. Address political, economic, social, technological, environmental, and legal factors affecting Tesla\'s strategic position. Consider regulatory trends in the EV industry, macroeconomic conditions, shifting consumer preferences, technological disruption, environmental policy, and legal/compliance landscape.]',
          '[PLACEHOLDER — Replace with your Porter\'s Five Forces analysis. Evaluate the threat of new entrants, bargaining power of suppliers, bargaining power of buyers, threat of substitutes, and competitive rivalry within Tesla\'s industry. Assess how these forces shape industry profitability and Tesla\'s strategic options.]',
        ],
      },
      {
        title: 'Internal Capability Evaluation',
        content: [
          '[PLACEHOLDER — Replace with your assessment of Tesla\'s internal resources, competencies, and value chain activities. Evaluate tangible and intangible resources, core competencies, and how Tesla\'s value chain (inbound logistics, operations, outbound logistics, marketing/sales, service, and support activities) contributes to competitive advantage.]',
        ],
      },
      {
        title: 'Competitive Positioning',
        content: [
          '[PLACEHOLDER — Replace with your competitive positioning analysis. Identify Tesla\'s strategic group, assess competitive advantage relative to key rivals, and evaluate how Tesla\'s positioning supports or constrains future strategic options.]',
        ],
      },
    ],
    charts: [
      {
        label: 'PESTEL Analysis Framework',
        placeholder: 'placeholder',
        description: 'Visual summary of key PESTEL factors affecting Tesla\'s strategic environment.',
      },
      {
        label: 'Porter\'s Five Forces Analysis',
        placeholder: 'placeholder',
        description: 'Assessment of competitive forces shaping Tesla\'s industry dynamics.',
      },
      {
        label: 'SWOT Analysis',
        placeholder: 'placeholder',
        description: 'Integrated view of Tesla\'s strengths, weaknesses, opportunities, and threats.',
      },
    ],
  },

  // ── Strategic Position Evaluation ──────────
  {
    id: 'strategic-position',
    title: 'Strategic Position Evaluation',
    content: [],
    subsections: [
      {
        title: 'Current Generic Strategy',
        content: [
          '[PLACEHOLDER — Replace with your assessment of Tesla\'s current generic strategy. Is Tesla pursuing cost leadership, differentiation, or a focus strategy? Provide evidence and analysis supporting your determination. Discuss how this strategy aligns with Tesla\'s resources and market positioning.]',
        ],
      },
      {
        title: 'Diversification Strategy',
        content: [
          '[PLACEHOLDER — Replace with your evaluation of Tesla\'s diversification strategy. Assess the scope and relatedness of Tesla\'s business portfolio (EVs, energy storage, solar, AI/autonomy, insurance, etc.). Evaluate whether this diversification creates or destroys value.]',
        ],
      },
      {
        title: 'International and Growth Strategies',
        content: [
          '[PLACEHOLDER — Replace with your analysis of Tesla\'s international and growth strategies. Evaluate market entry approaches, geographic expansion, and growth trajectories. Consider how Tesla balances global standardization with local responsiveness.]',
        ],
      },
      {
        title: 'Sustainability of Competitive Advantage',
        content: [
          '[PLACEHOLDER — Replace with your examination of whether Tesla\'s competitive advantages are sustainable. Apply VRIO or similar frameworks to assess the durability, imitability, and organizational support for Tesla\'s key advantages.]',
        ],
      },
    ],
    charts: [
      {
        label: 'Competitive Positioning Map',
        placeholder: 'placeholder',
        description: 'Visual representation of Tesla\'s position relative to competitors.',
      },
    ],
  },

  // ── Strategic Alternatives Assessment ──────
  {
    id: 'strategic-alternatives',
    title: 'Strategic Alternatives Assessment',
    content: [
      'This section identifies and evaluates two to three viable strategic alternatives for Tesla, applying structured criteria to assess each option\'s feasibility, suitability, and acceptability.',
    ],
    subsections: [
      {
        title: 'Alternative 1',
        content: [
          '[PLACEHOLDER — Replace with your first strategic alternative. Describe the alternative, then evaluate it against feasibility (can Tesla do it?), suitability (does it address the strategic situation?), and acceptability (will stakeholders support it?). Discuss associated risks and opportunities.]',
        ],
      },
      {
        title: 'Alternative 2',
        content: [
          '[PLACEHOLDER — Replace with your second strategic alternative, following the same evaluation structure.]',
        ],
      },
      {
        title: 'Alternative 3',
        content: [
          '[PLACEHOLDER — Replace with your third strategic alternative, following the same evaluation structure.]',
        ],
      },
    ],
    charts: [
      {
        label: 'Strategic Alternatives Comparison',
        placeholder: 'placeholder',
        description: 'Side-by-side evaluation of strategic alternatives against key criteria.',
      },
    ],
  },

  // ── Strategic Recommendations ──────────────
  {
    id: 'strategic-recommendations',
    title: 'Strategic Recommendations',
    content: [
      '[PLACEHOLDER — Replace with your detailed strategic recommendation. State your recommended strategic direction with clear rationale explaining why this alternative best addresses Tesla\'s strategic situation.]',
    ],
    subsections: [
      {
        title: 'Organizational Structure Alignment',
        content: [
          '[PLACEHOLDER — Discuss how Tesla\'s organizational structure should align with the recommended strategy. Address reporting relationships, coordination mechanisms, and any structural changes needed.]',
        ],
      },
      {
        title: 'Resource Allocation Requirements',
        content: [
          '[PLACEHOLDER — Detail the financial, human, and technological resources required to implement the recommended strategy. Address investment priorities and resource reallocation needs.]',
        ],
      },
      {
        title: 'Implementation Timeline',
        content: [
          '[PLACEHOLDER — Provide a phased implementation timeline with key milestones. Consider short-term (0–12 months), medium-term (1–3 years), and long-term (3–5 years) horizons.]',
        ],
      },
      {
        title: 'Key Performance Indicators',
        content: [
          '[PLACEHOLDER — Define specific, measurable KPIs for tracking implementation progress and strategic success. Include financial, operational, customer, and innovation metrics as appropriate.]',
        ],
      },
      {
        title: 'Implementation Challenges and Mitigation',
        content: [
          '[PLACEHOLDER — Identify potential implementation challenges and propose mitigation strategies. Consider organizational resistance, resource constraints, market uncertainties, and execution risks.]',
        ],
      },
    ],
    charts: [
      {
        label: 'Implementation Timeline',
        placeholder: 'placeholder',
        description: 'Phased timeline showing key milestones and strategic initiatives.',
      },
      {
        label: 'KPI Dashboard Framework',
        placeholder: 'placeholder',
        description: 'Framework for measuring strategic implementation success.',
      },
    ],
  },

  // ── Ethical and Sustainability Considerations ──
  {
    id: 'ethics-sustainability',
    title: 'Ethical and Sustainability Considerations',
    content: [
      '[PLACEHOLDER — Replace with your analysis of ethical implications of the recommended strategies. Address how the recommendations integrate sustainability principles, consider stakeholder impacts, and reflect responsible business practices. Discuss specific ethical tensions or trade-offs relevant to Tesla\'s strategic situation.]',
    ],
  },

  // ── Global Competitive Factors ─────────────
  {
    id: 'global-factors',
    title: 'Global Competitive Factors',
    content: [
      '[PLACEHOLDER — Replace with your analysis of how global competitive dynamics affect Tesla\'s strategic choices. Consider international market factors, geopolitical influences, global supply chain dynamics, trade policies, and cross-border competitive pressures relevant to your recommendations.]',
    ],
  },

  // ── References ─────────────────────────────
  {
    id: 'references',
    title: 'References',
    content: [
      '[PLACEHOLDER — Replace with your APA-formatted reference list. Include at least five credible sources supporting your analysis. Sources should include academic journals, industry reports, company filings, and other authoritative references.]',
    ],
  },
];
