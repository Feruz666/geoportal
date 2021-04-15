const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [new MiniCssExtractPlugin()],  
  entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'index.js',
        path: '/Users/odiljonbokhodirov/Desktop/projects/geoportal/geoportal/static/js'
    },
    resolve: {
        // ... rest of the resolve config
        fallback: {
          "path": require.resolve("path-browserify")
        }
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
}
