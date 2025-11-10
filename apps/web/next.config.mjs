/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  serverExternalPackages: ["@prisma/client", "@workspace/database"],
  experimental: {
    serverMinification: false,
    turbopackScopeHoisting: false
  }

}

export default nextConfig
