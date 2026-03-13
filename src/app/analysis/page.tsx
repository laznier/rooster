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
                    Supporting Resources
                  </p>
                  <div className="space-y-2">
                    <a
                      href="/assets/html/Tesla_Inc_Strategic_Opportunity_Analysis_2026-03-13_REPORT.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent-50 text-accent-700 text-sm font-medium rounded-lg border border-accent-200 hover:bg-accent-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                      Full Interactive Report
                    </a>
                    <a
                      href="/assets/slides/Tesla_Executive_Briefing_Slides_Final.pptx"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-50 text-navy-600 text-sm font-medium rounded-lg border border-navy-200 hover:bg-navy-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                      Executive Briefing Slides
                    </a>
                    <a
                      href="/assets/pdfs/Tesla%20-%20Risk%20of%20Strategic%20Pivot%20Implementation.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-50 text-navy-600 text-sm font-medium rounded-lg border border-navy-200 hover:bg-navy-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Risk of Strategic Pivot
                    </a>
                    <a
                      href="/assets/pdfs/Tesla%20implementation%20risk%20report.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-50 text-navy-600 text-sm font-medium rounded-lg border border-navy-200 hover:bg-navy-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Implementation Risk Report
                    </a>
                  </div>
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
