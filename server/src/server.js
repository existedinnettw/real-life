const express = require('express')
const { eventRouter } = require("./routers/event.js")
const { authRouter } = require("./routers/auth.js")
const { isAuthenticated } = require('./routers/auth')
const path = require('path');
const { port, callbackURL } = require('../config')
const cookieSession = require("cookie-session")
const cors = require('cors');
const passport = require('passport')
// const SocketServer = require('ws').Server
// const livereload = require('easy-livereload');

app = express()
// app.use(livereload({
//     watchDirs: [
//         path.join(process.cwd(), 'build'),
//     ],
//     app: app
// }));
/*****************/
app.use(cookieSession({
    maxAge: 1000 * 60 * 60 * 24,
    keys: [process.env.sessionKey]
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/', express.static('build')) //../client/build

app.get('/*/static/*', function (req, res) {
    //this redirect the static path to correct path event using react-router
    //https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
    const index = req.url.indexOf('static')
    const filePath = req.url.substr(index - 1)
    //console.log( filePath)
    res.redirect(filePath)
});

//app.use('/api/*', cors())
app.use('/api', isAuthenticated, eventRouter)

app.use('/auth', authRouter)//the oauth is impossible to be cors

app.get('/*', (req, res) => res.redirect('/'))//unknow path redirect back, or should use 404?

const server= app.listen(port, () => {
    console.log(`server is runing on port ${port} ...`)
    console.log(`cb url ${callbackURL}`)
})


// const wss = new SocketServer({ server })

// //當 WebSocket 從外部連結時執行
// wss.on('connection', ws => {

//     //連結時執行此 console 提示
//     console.log('Client connected')

//     //當 WebSocket 的連線關閉時執行
//     ws.on('close', () => {
//         console.log('Close connected')
//     })
// })
