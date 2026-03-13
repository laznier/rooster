import { workSamplesContent } from '@/content/workSamplesContent';
import { PageHero } from '@/components/PageHero';
import { WorkSampleCard } from '@/components/WorkSampleCard';

export default function WorkSamplesPage() {
  const { heading, subheading, samples } = workSamplesContent;

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
            {samples.map((sample) => (
              <WorkSampleCard key={sample.id} sample={sample} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
