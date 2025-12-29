

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Augmentem el límit
    },
  },
  // ... altres configuracions que tinguis
};

export default nextConfig;
