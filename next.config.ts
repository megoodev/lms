import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "ohilms",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
