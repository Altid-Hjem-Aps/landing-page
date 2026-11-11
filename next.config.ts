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
      // The brand book is a static folder under public/brand-<token>. The
      // token keeps the URL private: it is shared by link only and never
      // listed. Next does not serve a folder index, so the folder path opens
      // the page itself; the page's relative asset paths need the prefix.
      {
        source: "/brand-kuqbnes0j3n6zg",
        destination: "/brand-kuqbnes0j3n6zg/index.html",
        permanent: false,
      },
      // Fixed address for the Mad report that the App Store and Google Play
      // texts cite as source for the 11.207 kr. figure (ALT-1522). Temporary
      // on purpose: the file will move when altidmad.dk is folded into
      // altidhjem.dk. Change the destination here, never the address.
      {
        source: "/madrapport",
        destination: "https://altidmad.dk/altid-mad-kvartalsrapport-q3.pdf",
        permanent: false,
      },
      // Keep the canonical www host while serving app-association files on
      // the apex host without a redirect.
      {
        source: "/:path((?!\\.well-known).+)",
        has: [{ type: "host", value: "altidhjem.dk" }],
        destination: "https://www.altidhjem.dk/:path",
        permanent: false,
      },
      {
        source: "/",
        has: [{ type: "host", value: "altidhjem.dk" }],
        destination: "https://www.altidhjem.dk/",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      // Keep the brand book out of search engines; it is reachable by link only.
      {
        source: "/brand-kuqbnes0j3n6zg/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
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
