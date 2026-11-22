import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: { position: "bottom-right" },
  // Development only: let other devices on the home network (192.168.x.x) open the dev server.
  allowedDevOrigins: ["192.168.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // The live site sent /cms to the admin; keep that link working.
    return [{ source: "/cms", destination: "/admin", permanent: false }];
  },
};

export default nextConfig;
