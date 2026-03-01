import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@scriblmotion/core",
    "@scriblmotion/svg",
    "@scriblmotion/react",
  ],
};

export default nextConfig;
