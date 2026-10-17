import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Biome runs separately through pnpm lint.
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.scss": {
        loaders: ["sass-loader"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qg007gk6n2popinf.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
