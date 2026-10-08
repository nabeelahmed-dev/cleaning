import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client demo: tell search engines not to index, follow, cache or quote any
  // response (pages and files alike). Remove this for a real launch.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
