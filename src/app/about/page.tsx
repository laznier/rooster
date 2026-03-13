import { aboutContent } from '@/content/aboutContent';
import { PageHero } from '@/components/PageHero';
import { SectionHeading } from '@/components/SectionHeading';

export default function AboutPage() {
  const { heading, subheading, bio, competencies, education } = aboutContent;

  return (
    <>
      <PageHero
        title={heading}
        subtitle={subheading}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          {/* Bio */}
          <div className="prose-custom">
            {bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Competencies */}
      <section className="section-padding bg-navy-50">
        <div className="container-wide">
          <SectionHeading
            title="Core Competencies"
            subtitle="Strategic management capabilities developed through military leadership, graduate education, and professional experience."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map((comp, i) => (
              <div key={i} className="card">
                <h3 className="text-base font-semibold text-navy-900 mb-2">
                  {comp.area}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {comp.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading title="Education" />
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-3 w-3 rounded-full bg-accent-500" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{edu.degree}</p>
                  <p className="text-sm text-navy-600">{edu.institution}</p>
                  <p className="text-sm text-navy-400">{edu.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
