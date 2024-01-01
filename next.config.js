/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    apikey: process.env.apikey,
    network: process.env.network
  },
  webpack(config, { nextRuntime, isServer, dev }) {
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === "undefined") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    //   config.output.webassemblyModuleFilename =
    //   isServer && !dev
    //     ? '../static/wasm/[modulehash].wasm'
    //     : 'static/wasm/[modulehash].wasm'

    // // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
    // config.experiments = { ...config.experiments, asyncWebAssembly: true }

    const experiments = config.experiments || {};
    config.experiments = { ...experiments, asyncWebAssembly: true };
    config.output.assetModuleFilename = `static/[hash][ext]`;
    config.output.publicPath = `/_next/`;
    config.module.rules.push({
      test: /\.wasm/,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
