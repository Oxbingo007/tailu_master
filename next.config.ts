import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ['zh', 'en', 'fr'],
    defaultLocale: 'zh',
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
