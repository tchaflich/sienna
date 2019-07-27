const path = require('path');

module.exports = {
	entry: './src/js/index.js',

	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},

	mode: 'none',

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'eslint-loader',],
			},
			{
				test: /test\.js$/,
				use: {
					loader: 'mocha-loader',
				},
				exclude: /node_modules/,
			},
		],
	},
};
