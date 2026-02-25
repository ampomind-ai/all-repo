import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../../"
  },
  transpilePackages: [
    "@scriblmotion/core",
    "@scriblmotion/svg",
    "@scriblmotion/react",
  ],
};

export default nextConfig;
