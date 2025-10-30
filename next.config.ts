import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "lms.project.next.jsx.t3.storage.dev",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
