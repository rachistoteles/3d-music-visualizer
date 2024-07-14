const path = require("path");

module.exports = ({ development }) => ({
    entry: "./src/index.ts",
    devtool: development ? "inline-source-map" : false,
    mode: development ? "development" : "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ["babel-loader", "ts-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        library: {
            name: "MusicVisualizer",
            type: "umd",
            umdNamedDefine: true,
        },
        path: path.resolve(__dirname, "src"),
        filename: "index.js",
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "src"), 
        },
        compress: true,
        port: 9000, // You can change this port if needed
        open: true, // Automatically open the browser
    },
});
