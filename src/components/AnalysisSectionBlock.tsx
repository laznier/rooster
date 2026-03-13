import type { AnalysisSection } from '@/content/analysisContent';
import { ChartPlaceholder } from './ChartPlaceholder';

export function AnalysisSectionBlock({ section }: { section: AnalysisSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
        {section.title}
      </h2>
      {section.subtitle && (
        <p className="text-lg text-navy-500 mb-4">{section.subtitle}</p>
      )}
      <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-6" />

      {/* Main content paragraphs */}
      <div className="prose-custom">
        {section.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Subsections */}
      {section.subsections?.map((sub, i) => (
        <div key={i} className="mt-8">
          <h3 className="text-xl md:text-2xl font-semibold text-navy-800 mb-3">
            {sub.title}
          </h3>
          <div className="prose-custom">
            {sub.content.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </div>
        </div>
      ))}

      {/* Chart placeholders */}
      {section.charts && section.charts.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {section.charts.map((chart, i) => (
            <ChartPlaceholder
              key={i}
              label={chart.label}
              description={chart.description}
            />
          ))}
        </div>
      )}
    </section>
  );
}
