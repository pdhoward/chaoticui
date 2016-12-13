
const path =              require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer =      require('autoprefixer');
const webpack =           require('webpack');
const languages =         require('./app/i18n/languages');

const staticFolder = path.resolve(__dirname, 'assets');
const momentFilter = languages.map(lang => lang.iso).join('|');

var embedFileSize = 65536

var output = {
  path: staticFolder,
  filename: 'app.js',
  publicPath: '/'
}

var assetsLoaders = [
 { test: /\.css$/, loader: 'style!css' },
            { test: /(\.jsx|\.js)$/,
              loader: 'babel',
              exclude: /node_modules/
              },
            { test: /\.svg$/, loader: 'url?limit=10000' },
            { test: /\.png$/, loader: 'url?limit=10000&mimetype=image/png' },
            { test: /\.jpg$/, loader: 'url?limit=10000&mimetype=image/jpeg' },
            { test: /\.json$/, loader: 'json-loader' }

]

var scssLoaderProd = [
  { test: /(\.scss)$/, loader: ExtractTextPlugin.extract('style',
          'css?sourceMap&modules&importLoaders=1&localIdentName' +
          '=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox') }

]

var scssLoaderDev = [
  { test: /(\.scss)$/, loader: 'style!css?sourceMap&modules&importLoaders=1&' +
      'localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox' }
]


var lintLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'eslint'
}

var plugins = [
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp(momentFilter)),
  new ExtractTextPlugin('style.css', { allChunks: true }),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false,
      __USE_GA__: false,
      __GA_ID__: null
    })
]

var babelLoader = {
  loader: 'babel-loader',
  test: /\.jsx?$/,
  exclude: /node_modules/,
  // Options to configure babel
  query: {
    plugins: [],
    presets: ['es2015', 'stage-0', 'react']
  }
}

var commonConfig = {
  content: __dirname,

  output: output,

  standard: {
    parser: 'babel-eslint'
  },

  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

  resolve: {
      extensions: ['', '.js', '.jsx', '.scss'],
      modulesDirectories: [
          'node_modules',
          path.resolve(__dirname, './node_modules')
      ]
  },

  stats: {
    chunkModules: false,
    colors: true
  },

  toolbox: {
    theme: path.join(__dirname, 'app/theme.scss')
  }

}

var production = Object.assign({
  devtool: 'eval',
  content: __dirname,
  entry: [
    './app/index.jsx'
  ],

  plugins: plugins.concat([]),

  module: {
    loaders: [].concat(
      assetsLoaders, scssLoaderProd, babelLoader
    )
  }
}, commonConfig)

var development = Object.assign({
  port: 3000,
  devtool: 'inline-source-map',
  debug: true,
  content: __dirname,
  entry: [
	'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
	'./app/index.jsx',
  ],

  plugins: plugins.concat([]),

  module: {
    loaders: [].concat(
      assetsLoaders, scssLoaderDev, babelLoader
    ),
    preLoaders: [].concat(lintLoader)
  }

}, commonConfig)

module.exports = production
module.exports.development = development
