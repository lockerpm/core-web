const path = require("path")
const fs = require("fs")
const { DefinePlugin, ProvidePlugin, HtmlRspackPlugin } = require("@rspack/core")

module.exports = {
  entry: "./src/index.jsx",

  experiments: {
    css: true
  },

  stats: {
    warnings: false
  },

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/[name].js",
    publicPath: "/"
  },

  resolve: {
    fullySpecified: false,
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "process/browser": require.resolve("process/browser.js"),
      "@": path.resolve(__dirname, "src")
    },
    fallback: {
      process: require.resolve("process/browser.js"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      events: require.resolve("events/"),
      util: require.resolve("util/"),
      assert: require.resolve("assert/"),
      vm: false
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
                react: {
                  runtime: "automatic"
                }
              }
            }
          }
        }
      },

      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  "@primary-color": "#42a5f5",
                  "@text-selection-bg": "#1890ff"
                }
              }
            }
          }
        ]
      },

      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]
      },

      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ]
      },

      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource"
      }
    ]
  },

  plugins: [
    new HtmlRspackPlugin({
      template: "./public/index.html"
    }),

    new ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser"
    }),

    new DefinePlugin({
      "process.env": JSON.stringify(process.env)
    })
  ],

  devServer: {
    port: 3002,
    host: "demo.locker.io",
    hot: true,
    historyApiFallback: true,
    server: {
      type: "https",
      options: {
        key: fs.readFileSync("./demo.locker.io-key.pem"),
        cert: fs.readFileSync("./demo.locker.io.pem")
      }
    }
  }
}