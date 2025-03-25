import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: '/next_cards',
  images: { unoptimized: true },
};

export default nextConfig;
