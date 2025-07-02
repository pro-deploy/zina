import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['jsonwebtoken'],
  devIndicators: {
    buildActivity: false,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        hot: false,
        liveReload: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
