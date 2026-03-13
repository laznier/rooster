import Link from 'next/link';
import { homeContent } from '@/content/homeContent';
import { PreviewCard } from '@/components/PreviewCard';

export default function HomePage() {
  const { hero, introduction, previewCards } = homeContent;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy-900 text-white">
        <div className="container-wide py-20 md:py-28">
          <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-4">
            {hero.greeting}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            {hero.name}
          </h1>
          <p className="text-lg md:text-xl text-navy-300 font-medium mb-6">
            {hero.headline}
          </p>
          <p className="text-base md:text-lg text-navy-200 max-w-3xl leading-relaxed mb-10">
            {hero.subheadline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/analysis"
              className="inline-flex items-center px-6 py-3 bg-accent-600 text-white text-sm font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              View Strategic Analysis
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-navy-500 text-navy-200 text-sm font-semibold rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            {introduction.heading}
          </h2>
          <div className="h-0.5 w-12 bg-accent-500 rounded-full mb-6" />
          <p className="text-base md:text-lg text-navy-600 leading-relaxed">
            {introduction.text}
          </p>
        </div>
      </section>

      {/* Preview Cards */}
      <section className="section-padding bg-navy-50">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-2">
            Explore the Portfolio
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Navigate directly to any section of this ePortfolio.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {previewCards.map((card) => (
              <PreviewCard
                key={card.href}
                title={card.title}
                description={card.description}
                href={card.href}
                icon={card.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Site Design Note */}
      <section className="section-padding bg-white">
        <div className="container-narrow text-center">
          <p className="text-xs uppercase tracking-widest text-navy-400 font-medium mb-3">
            About This Site
          </p>
          <p className="text-sm text-navy-500 leading-relaxed max-w-2xl mx-auto">
            This ePortfolio was intentionally structured as a custom web application to organize 
            the comprehensive strategic analysis, course artifacts, and supporting evidence in a 
            professional digital portfolio format. The architecture reflects a deliberate design 
            that prioritizes clear navigation, strong content hierarchy, and a presentation 
            appropriate for academic and professional audiences.
          </p>
        </div>
      </section>
    </>
  );
}
