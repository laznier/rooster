import { artifactsContent } from '@/content/artifactsContent';
import { PageHero } from '@/components/PageHero';
import { ArtifactCard } from '@/components/ArtifactCard';

export default function ArtifactsPage() {
  const { heading, subheading, artifacts } = artifactsContent;

  return (
    <>
      <PageHero
        title={heading}
        subtitle={subheading}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </div>
        </div>
      </section>

      {/* Note about artifacts */}
      <section className="pb-16 bg-white">
        <div className="container-narrow text-center">
          <div className="p-6 bg-navy-50 rounded-xl border border-navy-100">
            <p className="text-sm text-navy-500 leading-relaxed">
              These artifacts represent key deliverables developed throughout MGMT 670, demonstrating 
              the progressive application of strategic management frameworks and analytical 
              capabilities. Each artifact contributes to the comprehensive strategic analysis 
              presented in this portfolio.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
