const express = require('express');
const bodyParser = require('body-parser')
const {isAuthenticated} = require('./auth')


let eventRouter= express.Router()

eventRouter.use(bodyParser.json())

//list
eventRouter.get('/events',isAuthenticated ,function(req, res, next){
    console.log('in events api')
    res.json(req.user)
    //let {} =req.body()
})


module.exports= {
    eventRouter
}