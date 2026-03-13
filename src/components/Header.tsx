'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { siteConfig } from '@/content/siteConfig';

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-wide flex h-16 items-center justify-between">
        {/* Logo / Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-sm font-bold text-white transition-colors group-hover:bg-accent-600">
            LM
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-navy-900 leading-tight">
              {siteConfig.name}
            </p>
            <p className="text-xs text-navy-500 leading-tight">
              {siteConfig.title}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-accent-700 bg-accent-50'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-navy-600 hover:bg-navy-50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-navy-100 bg-white px-6 py-4 space-y-1">
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'text-accent-700 bg-accent-50'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
