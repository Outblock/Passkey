/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { nextRuntime, isServer }) { 
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === "undefined") {
      config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
      };  
    }

    config.output.webassemblyModuleFilename = './node_modules/@trustwallet/wallet-core/dist/lib/wallet-core.wasm'

    config.experiments = { ...config.experiments, asyncWebAssembly: true }

    return config;
  },
};

module.exports = nextConfig;