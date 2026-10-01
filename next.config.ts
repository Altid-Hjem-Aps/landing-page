import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // SEO-siden flyttede til søgeords-slug (12. jun 2026) — 301 bevarer
      // evt. indekserede /elpriser-links og delte URL'er.
      {
        source: "/elpriser",
        destination: "/hvornar-er-strommen-billigst",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/ever", destination: "https://ever-preview.vercel.app/ever" },
      { source: "/ever/:path*", destination: "https://ever-preview.vercel.app/:path*" },
    ];
  },
};

export default nextConfig;
