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
      // Ever-decket bor i sit eget Vercel-projekt (athorup/ever-vc-deck) bag
      // sin egen adgangskode; /ever er bare en pænere adresse til det.
      { source: "/ever", destination: "https://ever-vc-deck.vercel.app/" },
      { source: "/ever/:path*", destination: "https://ever-vc-deck.vercel.app/:path*" },
    ];
  },
};

export default nextConfig;
