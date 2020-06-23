const express = require('express')
const passport = require('passport')
const {callbackURL} = require('../../config')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy(
    {
        clientID: process.env.googleClientID,
        clientSecret: process.env.googleClientSecret,
        callbackURL: callbackURL
    },
    function (req, accessToken, refreshToken, profile, done) { //the function is fixed
        //function execute after consent
        //console.log(email)
        // console.log('strategy cb:',req)
        // console.log('access token:',accessToken) //this is undefine actually
        // console.log('refresh token:',refreshToken) //this contain scope, id_token
        // console.log('profile:',profile)
        done(null,profile) //to serialize user
    }
))
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    //decouple session from cookie to get user data, and let it become req
    //console.log('deserialize user:',user )
    done(null, user)
})
//middleware to check if already authed


let authRouter = express.Router()
//google
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
authRouter.get('/google/callback', passport.authenticate('google'), function (req, res, next) {
    //consolelog login sucess
    res.redirect('/')
})
authRouter.get('/logout', isAuthenticated, function(req,res){
    req.logOut()
    console.log('log out')
    res.redirect('/')
})

function isAuthenticated(req, res, next) {

    if (req.user) {
        //return, or pass
        next()
    } else {
        //redirect to auth url
        console.log('not yet authenticated')
        res.redirect('/auth/google')
    }
}

module.exports = {
    authRouter,
    isAuthenticated
}