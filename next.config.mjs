/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.STATIC_EXPORT === 'true' && { output: 'export' }),
  basePath: process.env.PAGES_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
