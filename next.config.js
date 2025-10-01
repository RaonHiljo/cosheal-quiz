/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Vercel 빌드시 ESLint 에러 무시
  },
};

module.exports = nextConfig;
