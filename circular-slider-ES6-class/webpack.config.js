const path = require('path');

module.exports = {
 "mode": "none",
 "entry": "./src/app.js",
 "output": {
   "path": __dirname + '/dist',
   "filename": "bundle.js",
    "library": "Slider",
    "libraryTarget": "umd",
 },
 devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  devtool: 'eval-cheap-module-source-map',
  "module": {
    "rules": [
      {
        test: /\.scss$/,
        use: [
          "style-loader", //3. Inject styles into DOM
          "css-loader", //2. Turns css into commonjs
          "sass-loader" //1. Turns sass into css
        ]
      },
      {
        "test": /\.js$/,
        "exclude": /node_modules/,
        "use": {
          "loader": "babel-loader",
          "options": {
            "presets": [
              "@babel/preset-env",
            ],
            "plugins": ["@babel/plugin-proposal-nullish-coalescing-operator"]
          }
        }
      },
    ]
  },
  /* plugins: ["@babel/plugin-proposal-nullish-coalescing-operator"] */
}