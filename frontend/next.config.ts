import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {}, // IMPORTANT : active Turbopack et évite l’erreur Vercel
};

export default nextConfig;
