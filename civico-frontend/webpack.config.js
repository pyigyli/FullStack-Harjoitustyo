const path = require('path');
const webpack = require('./node_modules/webpack/lib/webpack');
const HtmlWebpackPlugin = require('./node_modules/html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('./node_modules/fork-ts-checker-webpack-plugin/lib');

const BROWSER_ENV_PREFIX = 'BROWSER_';

module.exports = () => ({
	entry: {
		vendor: [
			'@babel/polyfill'
		],
		main: ['react-hot-loader/patch', './src/client/index.tsx']
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-modules-ts-definitions-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							localIdentName: '[name]__[local]--[hash:base64:5]'
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[
								'@babel/preset-env',
								{targets: {browsers: 'last 2 versions'}}
							],
							'@babel/preset-typescript',
							'@babel/preset-react'
						],
						plugins: [
							['@babel/plugin-proposal-class-properties', {loose: true}],
							'react-hot-loader/babel',
							'@babel/plugin-syntax-dynamic-import'
						]
					}
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css']
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'build/client'),
		publicPath: '/'
	},
	devServer: {
		disableHostCheck: true,
		contentBase: path.resolve(__dirname, 'build/client'),
		publicPath: '/',
		port: process.env.PORT || 8888,
		historyApiFallback: {
			rewrites: [
				{from: /^(\/.*)?$/, to: '/'}
			]
		},
		before(app) {
			app.get('/env.js', (_req, res) => {
				const envStr = Object.keys(process.env)
					.filter(key => key.startsWith(BROWSER_ENV_PREFIX))
					.map(key => `${key.substr(BROWSER_ENV_PREFIX.length)}:'${process.env[key]}'`)
					.join(',');
				res.end(`window.env = {${envStr}}`);
			});
		}
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
			chunks: ['vendor', 'main']
		})
	]
});
