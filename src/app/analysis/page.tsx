'use client';

import Link from 'next/link';
import { analysisMetadata, analysisSections } from '@/content/analysisContent';
import { AnalysisSectionBlock } from '@/components/AnalysisSectionBlock';

export default function AnalysisPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-navy-900 text-white">
        <div className="container-wide py-16 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-navy-300 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <p className="text-sm font-medium text-accent-400 uppercase tracking-widest mb-3">
            {analysisMetadata.briefingRound}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-2">
            {analysisMetadata.title}
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-accent-300 mb-4">
            {analysisMetadata.subtitle}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-300">
            <span>{analysisMetadata.author}</span>
            <span className="hidden sm:inline">·</span>
            <span>{analysisMetadata.course}</span>
            <span className="hidden sm:inline">·</span>
            <span>{analysisMetadata.university}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-400 mt-1">
            <span>{analysisMetadata.professor}</span>
            <span className="hidden sm:inline">·</span>
            <span>{analysisMetadata.date}</span>
          </div>
          <div className="mt-6 h-1 w-16 rounded-full bg-accent-500" />
        </div>
      </div>

      {/* Layout: Sidebar TOC + Content */}
      <div className="bg-white">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12">
            {/* Table of Contents (sticky sidebar) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-4">
                  Table of Contents
                </p>
                <nav className="space-y-1">
                  {analysisSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-3 py-1.5 text-sm text-navy-500 hover:text-accent-700 hover:bg-accent-50 rounded-md transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>

                {/* Download placeholder */}
                <div className="mt-8 pt-6 border-t border-navy-100">
                  <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">
                    Resources
                  </p>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-50 text-navy-600 text-sm font-medium rounded-lg border border-navy-200 hover:bg-navy-100 transition-colors cursor-default"
                    title="Upload your PDF to public/ and link it here"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <p className="text-xs text-navy-400 mt-2 text-center">
                    PDF link placeholder
                  </p>
                </div>
              </div>
            </aside>

            {/* Mobile TOC */}
            <details className="lg:hidden mb-6 p-4 bg-navy-50 rounded-xl border border-navy-100">
              <summary className="text-sm font-semibold text-navy-800 cursor-pointer">
                Table of Contents
              </summary>
              <nav className="mt-3 space-y-1">
                {analysisSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-1.5 text-sm text-navy-500 hover:text-accent-700 rounded-md transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </details>

            {/* Main Analysis Content */}
            <div className="min-w-0">
              <div className="space-y-16">
                {analysisSections.map((section) => (
                  <AnalysisSectionBlock key={section.id} section={section} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
