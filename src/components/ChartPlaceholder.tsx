/* eslint-disable @next/next/no-img-element */

interface ChartPlaceholderProps {
  label: string;
  description?: string;
  imageSrc?: string;
}

export function ChartPlaceholder({ label, description, imageSrc }: ChartPlaceholderProps) {
  if (imageSrc) {
    return (
      <figure className="my-6">
        <div className="rounded-xl border border-navy-200 overflow-hidden bg-white shadow-sm">
          <img
            src={imageSrc}
            alt={label}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
        <figcaption className="mt-3 text-center">
          <p className="text-sm font-semibold text-navy-700">{label}</p>
          {description && (
            <p className="mt-1 text-xs text-navy-400">{description}</p>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="my-8 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-8 text-center">
      <div className="flex justify-center mb-3">
        <svg className="w-10 h-10 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-navy-600">{label}</p>
      {description && (
        <p className="mt-1 text-xs text-navy-400">{description}</p>
      )}
    </div>
  );
}
