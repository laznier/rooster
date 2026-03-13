/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChartPlaceholderProps {
  label: string;
  description?: string;
  imageSrc?: string;
}

export function ChartPlaceholder({ label, description, imageSrc }: ChartPlaceholderProps) {
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => setExpanded(false), []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded, close]);

  if (imageSrc) {
    return (
      <>
        <figure className="my-6 group cursor-pointer" onClick={() => setExpanded(true)}>
          <div className="rounded-xl border border-navy-200 overflow-hidden bg-white shadow-sm transition-shadow group-hover:shadow-md group-hover:border-accent-300">
            <img
              src={imageSrc}
              alt={label}
              className="w-full h-auto"
              loading="lazy"
            />
            <div className="flex items-center justify-center gap-1 py-1.5 bg-navy-50 text-navy-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              Click to enlarge
            </div>
          </div>
          <figcaption className="mt-3 text-center">
            <p className="text-sm font-semibold text-navy-700">{label}</p>
            {description && (
              <p className="mt-1 text-xs text-navy-400">{description}</p>
            )}
          </figcaption>
        </figure>

        {/* Lightbox overlay */}
        {expanded && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
            onClick={close}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div
              className="max-w-[95vw] max-h-[90vh] overflow-auto rounded-lg bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageSrc}
                alt={label}
                className="w-auto h-auto max-w-full"
              />
              <p className="px-4 py-3 text-center text-sm font-semibold text-navy-700 border-t border-navy-100">{label}</p>
            </div>
          </div>
        )}
      </>
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
