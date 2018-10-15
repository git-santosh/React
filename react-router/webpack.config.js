const path = require('path');
var webpack = require("webpack");
module.exports = {
    entry: './App.js',
    output:{
        //path:'dist',
        filename:'bundle.js'
    },
    module:{
        loaders:[
            {
                test: /\.js$/,
				exclude: /(node_modules)/,
                loader: ["babel-loader"],
                query: {
					presets: ["latest", "stage-0", "react"]
				}
            }
        ]
    }
}