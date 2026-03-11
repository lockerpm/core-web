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
      // Skip parsing papaparse.min.js to avoid Babel stack overflow
      config.module.noParse = /node_modules\/papaparse\/papaparse\.min\.js/;

      // Exclude papaparse from babel-loader to prevent stack overflow on large minified file
      config.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (
              oneOfRule.loader &&
              oneOfRule.loader.includes('babel-loader')
            ) {
              if (!oneOfRule.exclude) {
                oneOfRule.exclude = [];
              }
              if (!Array.isArray(oneOfRule.exclude)) {
                oneOfRule.exclude = [oneOfRule.exclude];
              }
              oneOfRule.exclude.push(/node_modules\/papaparse/);
            }
          });
        }
      });

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
