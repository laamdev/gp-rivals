/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    ppr: 'incremental',
    after: true
  },

  images: {
    domains: ['res.cloudinary.com']
  }
}

export default nextConfig
