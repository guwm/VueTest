import webpack from 'webpack'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'

import eslintFriendlyFormatter from 'eslint-friendly-formatter'

import autoprefixer from 'autoprefixer'
import postcssPxtorem from 'postcss-pxtorem'
import postcssClean from 'postcss-clean'

export default {
    entry: {
        vendor: ['vue', 'vue-router', 'vuex', 'vuex-router-sync'],
        vx: [
            './src/main.js'
        ]/*,
        app: [
            './app/main.js'
        ]*/
    },
    devtool: false,
    output: {
        path: `www`,
        publicPath: '',
        filename: 'js/[name].[chunkhash:7].js',
        chunkFilename: '[id].[chunkhash].js' //非入口文件的命名规则
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        alias: {
            // assets: `${process.cwd()}/src/assets`,
            // components: `${process.cwd()}/src/components`
        }
    },
    module: {
        preLoaders: [{
            test: /\.(vue|js)$/,
            exclude: /node_modules/,
            loader: 'eslint'
        }],

        loaders: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?|iconfont.svg$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: `fonts/[name].[hash:7].[ext]`
            }
        }]
    },
    eslint: {
        formatter: eslintFriendlyFormatter
    },
    vue: {
        postcss: [
            autoprefixer({
                browsers: ['last 2 versions', 'iOS >= 7', 'Android >= 4']
            }),
            // https://github.com/ben-eb/cssnano
            /*cssnano({ // just used in production
                safe: true
            }),*/
            postcssClean(),
            // https://github.com/hail2u/node-css-mqpacker
            // cssMqpacker(),
            // 肯定最好是用postcss，flexible布局生成了太多的[dpr-*]样式，所以作为实验暂时先不考虑用了，用pxtorem代替（注意：不同于px2rem）
            // https://github.com/cuth/postcss-pxtorem
            postcssPxtorem({
                rootValue: 100,
                unitPrecision: 5,
                propWhiteList: [],
                selectorBlackList: [], 
                replace: true,
                mediaQuery: false,
                minPixelValue: 0
            })
        ],
        loaders: {
            sass: ExtractTextPlugin.extract('css-loader!sass-loader', {
                publicPath: '../'
            })
        }
    },
    plugins: [
        new ProgressBarPlugin({
            format: '[:bar] :percent (:elapseds)',
            clear: true,
            summary: false,
            summaryContent: false
        }),

        new CleanWebpackPlugin(['www'], {
            root: `${process.cwd()}`
        }),
        
        /*new webpack.ProvidePlugin({
            "Vue": 'vue'
        }),*/
        // http://vue-loader.vuejs.org/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: false
        }),
        // https://github.com/webpack/extract-text-webpack-plugin
        new ExtractTextPlugin('css/[name].[contentHash:7].css', {
            allChunks: true
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity // 不需要抽取公共代码到这个文件中，因为目前我们的bundle只有一个
        }),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            chunks: ['vendor', 'vx'],
            filename: 'index.html',
            template: 'site/template/vx-flex.html',
            // favicon: '',
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }
        }),
        /*new HtmlWebpackPlugin({
            chunks: ['vendor', 'app'],
            filename: 'app/index.html',
            template: 'site/template/vx-flex.html',
            // favicon: '',
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyCSS: true,
                minifyJS: true
            }
        })*/
    ]
}
