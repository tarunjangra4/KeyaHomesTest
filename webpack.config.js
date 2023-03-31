const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.css$/,
        include: path.resolve(
          __dirname,
          "src/intl-tel-input-17.0.19/build/css",
          "css"
        ),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "asset/",
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        include: path.resolve(__dirname, "src/asset"),
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
    }),
  ],
  mode: "production",
};
