import type { Artifact } from '@/content/artifactsContent';

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge">{artifact.unit}</span>
      </div>
      <h3 className="text-lg font-semibold text-navy-900 mb-2">
        {artifact.title}
      </h3>
      <p className="text-sm text-navy-600 leading-relaxed flex-1 mb-4">
        {artifact.description}
      </p>
      <div className="pt-4 border-t border-navy-100">
        <p className="text-xs font-medium text-navy-400 uppercase tracking-wider mb-1">
          Skill Demonstrated
        </p>
        <p className="text-sm text-navy-600">
          {artifact.skillDemonstrated}
        </p>
      </div>
      {artifact.link && (
        <a
          href={artifact.link}
          className="mt-4 inline-flex items-center text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
        >
          {artifact.linkLabel || 'View'}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
