import type { WorkSample } from '@/content/workSamplesContent';

export function WorkSampleCard({ sample }: { sample: WorkSample }) {
  return (
    <div className="card flex flex-col h-full">
      <span className="badge mb-3 self-start">{sample.category}</span>
      <h3 className="text-lg font-semibold text-navy-900 mb-2">
        {sample.title}
      </h3>
      <p className="text-sm text-navy-600 leading-relaxed flex-1 mb-4">
        {sample.description}
      </p>
      <div className="pt-4 border-t border-navy-100">
        <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">
          Relevance
        </p>
        <p className="text-sm text-navy-600">
          {sample.relevance}
        </p>
      </div>
      {sample.link && (
        <a
          href={sample.link}
          className="mt-4 inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
        >
          {sample.linkLabel || 'View'}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
