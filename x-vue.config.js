const webpack = require('webpack')
// const path = require("path");

// module.exports = {
//   outputDir: path.resolve(__dirname, "../backend/templates/SPA"),
//   assetsDir: "../../static/SPA"
// }
module.exports = {
  configureWebpack: {},
  publicPath: process.env.NODE_ENV === 'production' ? '/mtnnfprojects/' : '/'
  // publicPath:
  //   process.env.NODE_ENV === 'production'
  //     ? '/mtn/mtnf-map/wp-content/plugins/mtnnf-map/templates/mtnnfprojects/dist/'
  //     : '/'
  // publicPath: process.env.NODE_ENV === 'production'
  //     ? '/mtnnfmap/'
  //     : '/'
}
