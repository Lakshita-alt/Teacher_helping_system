/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
   experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default nextConfig;
