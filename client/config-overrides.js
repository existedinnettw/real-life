const { injectBabelPlugin, } = require('react-app-rewired');
const path = require("path")

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  //https://medium.com/@timarney/but-i-dont-wanna-eject-3e3da5826e39
  //console.log(config.resolve.alias)
  config.resolve.alias = {
    api: path.resolve(__dirname, 'src/api/'),
    util: path.resolve(__dirname, 'src/util/'),
    component: path.resolve(__dirname, 'src/component/'),
  }
  return config;
}