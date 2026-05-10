/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Static export was removed to enable Next.js API routes for the
  // /validation interview backend. Deploy via Vercel (or any Node Next.js host).
  ...(process.env.PAGES_BASE_PATH ? { basePath: process.env.PAGES_BASE_PATH } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
