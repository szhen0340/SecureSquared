import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("encoding", "fs"); // https://github.com/vercel/next.js/discussions/54109
    return config;
  },
};

export default nextConfig;
