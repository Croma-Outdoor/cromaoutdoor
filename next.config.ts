import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Turbopack to treat this folder as the project root to avoid parent lockfiles being detected as the workspace.
    root: __dirname,
  },
};

export default nextConfig;
