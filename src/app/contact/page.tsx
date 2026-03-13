import { contactContent } from '@/content/contactContent';
import { PageHero } from '@/components/PageHero';

export default function ContactPage() {
  const { heading, subheading, message, linkedin } = contactContent;

  return (
    <>
      <PageHero
        title={heading}
        subtitle={subheading}
        breadcrumb={{ label: 'Home', href: '/' }}
      />

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-base md:text-lg text-navy-600 leading-relaxed mb-10">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white text-sm font-semibold rounded-lg hover:bg-[#004182] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {linkedin.label}
              </a>
              <a
                href={linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-navy-200 text-navy-700 text-sm font-semibold rounded-lg hover:bg-navy-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {linkedin.followLabel}
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-navy-100">
              <p className="text-xs text-navy-400">
                MGMT 670 — Strategic Management Capstone
              </p>
              <p className="text-xs text-navy-400 mt-1">
                University of Maryland Global Campus — March 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
