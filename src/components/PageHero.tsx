import Link from 'next/link';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string };
}

export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <div className="bg-navy-900 text-white">
      <div className="container-wide py-16 md:py-20">
        {breadcrumb && (
          <Link
            href={breadcrumb.href}
            className="inline-flex items-center text-sm text-navy-300 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {breadcrumb.label}
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-navy-200 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-6 h-1 w-16 rounded-full bg-accent-500" />
      </div>
    </div>
  );
}
