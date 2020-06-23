var gulp = require('gulp');
// 调用 .create() 意味着你得到一个唯一的实例并允许您创建多个服务器或代理。
var browserSync = require('browser-sync').create();
// 这里reload不加括号，只引用不调用
// var reload = browserSync.reload;
var env = require('gulp-env');

var nodemon = require('gulp-nodemon');
gulp.task('server', function () {
    env({
        file: '.env',
        type: 'ini',
        vars: {
            // any variables you want to overwrite
        }
    });
    stream=nodemon({
        script: 'src/server.js', //'app.js',
        // 忽略部分对程序运行无影响的文件的改动，nodemon只监视js文件，可用ext项来扩展别的文件类型
        // ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
        env: {
            'NODE_ENV': 'development'
        },
        delay:500
    }).on('start', function () {
        browserSync.init({
            proxy: 'http://localhost:4000',
            files: ["public/**/*.*", "views/**", "routes/**", "build/**"],
            port: 8080,
        }, function () {
            console.log("browser refreshed.");
        });
    })

    stream.on('restart', function () {
        console.log('restarted!')
    }).on('crash', function () {
        console.error('Application has crashed!\n')
        stream.emit('restart', 10)  // restart the server in 10 seconds
    })
});