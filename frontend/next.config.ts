import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Configuration pour résoudre les problèmes avec face-api.js et TensorFlow.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        encoding: false,
      };
    }

    // Ignorer les warnings spécifiques à face-api.js
    config.ignoreWarnings = [
      { module: /node_modules\/face-api\.js/ },
      { module: /node_modules\/@tensorflow/ },
      { file: /node_modules\/face-api\.js/ },
    ];

    return config;
  },
  // Suppression de experimental.esmExternals car déprécié dans Next.js 15
};

export default nextConfig;
