import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.t3.tigrisfiles.io",
      },
      {
        // GitHub avatars (for user profile images)
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        // Google profile images
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push("@prisma/client", "@prisma/internals");
    return config;
  },
};

export default nextConfig;
