const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: ['./src/js/index.js', './src/scss/index.scss'],

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
	],

	mode: 'none',

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader'],
			},
			{
				test: /test\.js$/,
				use: {
					loader: 'mocha-loader',
				},
				exclude: /node_modules/,
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							// data: "$env: " + process.env.NODE_ENV + ";"
						},
					},
				],
			},
		],
	},
};
