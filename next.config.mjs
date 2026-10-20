/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — app is fully client-side (localStorage). Deploys cleanly
  // to Cloudflare Workers static assets without needing Next.js 15+ / OpenNext.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
