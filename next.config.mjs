/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        destination: "https://meditaciones-ma.vercel.app/:path*",
        has: [{ type: "host", value: "meditaciones-ma-git-claude-warm-be-364f82-mukunda-labs-projects.vercel.app" }],
        permanent: false,
      },
    ];
  },
}

export default nextConfig
