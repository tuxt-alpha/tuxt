import { resolve, isAbsolute } from 'path'
import consola from 'consola'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackBarPlugin from 'webpackbar'
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

export default class WebpackBase {
  constructor(tuxt) {
    this.tuxt = tuxt
    this.options = this.tuxt.options
  }

  get mode() {
    return this.tuxt.env
  }

  get dev() {
    return this.mode === 'development'
  }

  get prod() {
    return this.mode === 'production'
  }

  get head() {
    return this.options.head
  }

  resolve(...args) {
    return resolve(this.options.srcPath, ...args)
  }

  chunkname(chunk = 'full') {
    return this.prod ? 'js/[name].[' + chunk + 'hash:7].js' : '[name].js'
  }

  assetname(asset) {
    return this.prod ? asset + '/[name].[contenthash:7].[ext]' : '[name].[ext]'
  }

  output() {
    return {
      filename: this.chunkname(),
      chunkFilename: this.chunkname('chunk'),
      path: this.options.distPath,
      publicPath: '/',
    }
  }

  rules() {
    return [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|dist|static)/,
        loader: 'babel-loader',
        options: this.babelOptions(),
      },
      {
        test: /\.css$/,
        use: this.cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: this.sassLoaders(),
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 10240,
          name: this.assetname('imgs'),
          fallback: 'file-loader',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: this.assetname('fonts'),
        }
      },
    ]
  }

  cssLoaders() {
    const loaders = [{
      loader: 'css-loader',
      options: {
        // // Subsequent support for css modules
        // modules: false, 
        // Some pre-loaders that need to be called before `@import`,
        importLoaders: 1,
        // Absolute path does not handle url, 
        // And Use static resource images in public-path.
        url: (url, resourcePath) => isAbsolute(url) ? false : true,
      }
    }]

    if (this.options.postcss) {
      loaders.push(this.postcssLoader())
    }

    return loaders
  }

  postcssLoader() {
    const userPostcss = this.options.postcss
    const defaultPostcss = {
      plugins: ['autoprefixer'],
    }
    return {
      loader: 'postcss-loader',
      options: {
        postcssOptions: typeof userPostcss === 'object' ? Object.assign(defaultPostcss, userPostcss) : defaultPostcss
      },
    }
  }

  sassLoaders() {
    const loaders = this.cssLoaders()

    loaders.push({
      loader: 'sass-loader',
      // options: {
      //   implementation: require.resolve('sass'), // or require('sass')
      //   sassOptions: {
      //     fiber: require('fibers'),
      //   }
      // }
    })

    return loaders
  }

  babelOptions() {
    const userBabel = this.options.babel
    const defaultBabel = {
      // configFile: false,
      // babelrc: false,
      plugins: [
        ['@babel/plugin-transform-runtime', {
          corejs: 3,
          proposals: true,
        }]
      ],
      presets: [
        ['@babel/preset-env', {
          targets: '> 1%, not dead',
          bugfixes: true,
          useBuiltIns: 'usage',
          corejs: '3.15',
        }],
        ['@vue/babel-preset-jsx', {
          vModel: true,
          vOn: true,
        }]
      ],
    }
    return Object.assign(defaultBabel, userBabel)
  }

  htmlPluginOptions() {
    const options = {
      filename: 'index.html',
      template: this.resolve('index.html'),
      inject: 'body',
    }
    const { title, meta, favicon } = this.head

    if (typeof title === 'string') {
      options.title = title
    }

    if (meta instanceof Array) {
      options.meta = meta.reduce((_meta, item) => (_meta[item.name] = item.content, _meta), {})
    }

    if (typeof favicon === 'string') {
      options.favicon = favicon
    }

    return options
  }

  plugins() {
    return [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin(this.htmlPluginOptions()),
      new WebpackBarPlugin({
        name: 'Tuxt build',
        reporter: {
          change(context, {
            shortPath
          }) {
            consola.log({
              type: 'change',
              icon: '»',
              message: `Watching ${shortPath} is changed`
            })
          }
        }
      }),
      // new HardSourceWebpackPlugin(),
    ]
  }

  optimization() {
    return {
      runtimeChunk: {
        name: 'runtime'
      },
      splitChunks: {
        chunks: 'all',
        minSize: 20 * 1024,
        automaticNameDelimiter: '.',
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          }
        }
      }
    }
  }

  config() {
    return {

      mode: this.mode,

      context: this.options.buildPath,

      entry: {
        app: './main.js',
      },

      output: this.output(),

      module: {
        rules: this.rules(),
      },

      resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
          '@@': process.cwd(),
        }
      },

      plugins: this.plugins(),

      optimization: this.optimization(),

      performance: {
        hints: this.dev ? false : 'warning',
        maxEntrypointSize: 500 * 1024, // limit 500kb
        maxAssetSize: 500 * 1024,
      },

    }
  }
}