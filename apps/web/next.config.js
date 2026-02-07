/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@repo/agent-core",
    "@repo/shared-types",
    "@repo/notion-integration",
    "@repo/linear-integration",
    "@repo/browserbase-integration",
    "@repo/voice",
  ],
};

export default nextConfig;
