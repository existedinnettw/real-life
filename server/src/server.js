const express = require('express')
const { eventRouter } = require("./routers/event.js")
const { authRouter} =require("./routers/auth.js")
const {port}=require('../config')
const cookieSession =require("cookie-session")
let cors = require('cors');
const passport = require('passport')

app = express()
app.use(cookieSession({
    maxAge: 1000*60*60*24,
    keys: ['this_is_session_key_eeee']
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/', express.static('dist'))

app.use('/api',cors())
app.use('/api', eventRouter)

app.use('/auth', authRouter )

app.get('/*', (req, res) => res.redirect('/'))//unknow path redirect back, or should use 404?

app.listen(port, () => {
    console.log(`server is runing on port ${port} ...`)
})