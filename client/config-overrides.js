const { injectBabelPlugin, } = require('react-app-rewired');
const path = require("path")
const rewireDefinePlugin = require('@yeutech-lab/react-app-rewire-define-plugin');
const fs = require('fs');
const FileManagerPlugin = require('filemanager-webpack-plugin');
let outputPath = './build'; //'../server/build';

console.log('/**********************************/')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('HOST_ENV:', process.env.HOST_ENV)
let url = ''
if (process.env.HOST_ENV === 'aws') {
  url = `${process.env.AWS_URL}`
} else { //(process.env.NODE_ENV === 'development')
  url = `${process.env.LOCAL_URL}`
}
console.log(`Api url is: ${JSON.stringify(url+'/api')}`)

module.exports = {
  webpack: function (config, env) {
    //do stuff with the webpack config...
    //https://medium.com/@timarney/but-i-dont-wanna-eject-3e3da5826e39
    //console.log('webpack config:',config)


    // const definePlugin = new webpack.DefinePlugin({
    //   'API_URL': url
    // })

    config.resolve.alias = {
      api: path.resolve(__dirname, 'src/api/'),
      util: path.resolve(__dirname, 'src/util/'),
      component: path.resolve(__dirname, 'src/component/'),
      state: path.resolve(__dirname, 'src/state')
    }
    config = rewireDefinePlugin(config, env, {
      'process.env.API_URL': JSON.stringify(url+'/api'),
      'process.env.BASE_URL': JSON.stringify(url),
      'process.env.VERSION': JSON.stringify(require('./package.json').version)
    })
    config.plugins.push(
      new FileManagerPlugin({
        onEnd: {
          copy: [{
            source: outputPath,
            destination: '../server/build/',
          }],
        },
      })
    )

    //watch mode build
    const appDirectory = fs.realpathSync(process.cwd());
    const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
    config.output.path = resolveApp(outputPath);

    console.log('webpack config:',config)
    return config;
  },

  devServer: function (configFunction) {
    //watch mode build, actually, it change npm run start command
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.writeToDisk = true;
      const basePath = path.join(__dirname, 'build')
      //"C:/Users/insleker/Google Drive/projects/real-life/server/build" Watching remote files is not supported.
      //let basePath="C:/Users/insleker/Google Drive/projects/real-life/server/build"
      config.contentBase = basePath
      config.proxy= {'/api':url, '/auth':url}
      console.log('dev server config:', config)
      return config;
    };
  }
}