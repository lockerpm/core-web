const CracoLessPlugin = require('craco-less');
const webpack = require("webpack");

module.exports = {
  babel: {
    plugins: [
      ['import', { libraryName: '@lockerpm/design', libraryDirectory: 'es', style: true }],
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#42a5f5',
              '@text-selection-bg': '#1890ff',
            },
            javascriptEnabled: true
          },
        },
      },
    },
  ],
  typescript: {
    enableTypeChecking: false,
  },
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'process/browser': require.resolve("process/browser"),
        process: require.resolve("process/browser"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        vm: false,
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );
      return config;
    },
  },
}
