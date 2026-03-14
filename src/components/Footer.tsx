import { siteConfig } from '@/content/siteConfig';

export function Footer() {
  return (
    <footer className="border-t border-navy-800/50 bg-navy-950">
      <div className="container-wide py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-600 text-xs font-bold text-white">
                R
              </span>
              <p className="text-sm font-semibold text-white">
                {siteConfig.name}
              </p>
            </div>
            <p className="text-sm text-navy-400">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-navy-200 mb-3">Navigate</p>
            <nav className="space-y-2">
              {siteConfig.navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-navy-400 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <p className="text-sm font-semibold text-navy-200 mb-3">Connect</p>
            <p className="text-sm text-navy-400 leading-relaxed mb-4">
              This venture is in early-stage development. All inquiries are welcome
              through LinkedIn.
            </p>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800">
          <p className="text-xs text-navy-500 text-center">
            {siteConfig.footer.line1}
          </p>
          <p className="text-xs text-navy-500 text-center mt-1">
            {siteConfig.footer.line2}
          </p>
        </div>
      </div>
    </footer>
  );
}
